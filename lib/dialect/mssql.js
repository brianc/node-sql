// TODO: visitCreate needs to support schemas
// TODO: visitDrop needs to support schemas

'use strict';

var util = require('util');
var assert = require('assert');

/**
 * Config can contain:
 *
 * questionMarkParameterPlaceholder:true which will use a "?" for the parameter placeholder instead of the @index.
 *
 * @param config
 * @constructor
 */
var Mssql = function(config) {
  this.output = [];
  this.params = [];
  this.config = config || {};
};

var Postgres = require(__dirname + '/postgres');

util.inherits(Mssql, Postgres);

Mssql.prototype._myClass = Mssql;

Mssql.prototype._quoteCharacter = '[';

Mssql.prototype._arrayAggFunctionName = '';

Mssql.prototype._getParameterPlaceholder = function(index, value) {
  if (this.config.questionMarkParameterPlaceholder) return '?';
  return '@' + index;
};

Mssql.prototype.visitBinary = function(binary) {
  if(binary.operator === '@@'){
    var self = this;
    var text = '(CONTAINS (' + this.visit(binary.left) + ', ';
    text += this.visit(binary.right);
    text += '))';
    return [text];
  }

  if (!isRightSideArray(binary)){
    return Mssql.super_.prototype.visitBinary.call(this, binary);
  }
  if (binary.operator=='IN' || binary.operator=='NOT IN'){
    return Mssql.super_.prototype.visitBinary.call(this, binary);
  }
  throw new Error('SQL Sever does not support arrays in this type of expression.');
};

Mssql.prototype.visitAlter = function(alter) {
  var self=this;
  var errMsg='ALTER TABLE cannot be used to perform multiple different operations in the same statement.';

  // Implement our own add column:
  //   PostgreSQL: ALTER TABLE "name" ADD COLUMN "col1", ADD COLUMN "col2"
  //   Mssql:  ALTER TABLE [name] ADD [col1], [col2]
  function _addColumn(){
    self._visitingAlter = true;
    var table = self._queryNode.table;
    self._visitingAddColumn = true;
    var result='ALTER TABLE '+self.visit(table.toNode())+' ADD '+self.visit(alter.nodes[0].nodes[0]);
    for (var i= 1,len=alter.nodes.length; i<len; i++){
      var node=alter.nodes[i];
      assert(node.type=='ADD COLUMN',errMsg);
      result+=', '+self.visit(node.nodes[0]);
    }
    self._visitingAddColumn = false;
    self._visitingAlter = false;
    return [result];
  }

  // Implement our own drop column:
  //   PostgreSQL: ALTER TABLE "name" DROP COLUMN "col1", DROP COLUMN "col2"
  //   Mssql:  ALTER TABLE [name] DROP COLUMN [col1], [col2]
  function _dropColumn(){
    self._visitingAlter = true;
    var table = self._queryNode.table;
    var result=[
      'ALTER TABLE',
      self.visit(table.toNode())
    ];
    var columns='DROP COLUMN '+self.visit(alter.nodes[0].nodes[0]);
    for (var i= 1,len=alter.nodes.length; i<len; i++){
      var node=alter.nodes[i];
      assert(node.type=='DROP COLUMN',errMsg);
      columns+=', '+self.visit(node.nodes[0]);
    }
    result.push(columns);
    self._visitingAlter = false;
    return result;
  }

  // Implement our own rename table:
  //   PostgreSQL: ALTER TABLE "post" RENAME TO "posts"
  //   Mssql:  EXEC sp_rename [post], [posts]
  function _rename(){
    self._visitingAlter = true;
    var table = self._queryNode.table;
    var result = ['EXEC sp_rename '+self.visit(table.toNode())+', '+self.visit(alter.nodes[0].nodes[0])];
    self._visitingAlter = false;
    return result;
  }

  // Implement our own rename column:
  //   PostgreSQL: ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"
  //   Mssql:  EXEC sp_rename '[group].[userId]', [newUserId]
  function _renameColumn(){
   self._visitingAlter = true;
   var table = self._queryNode.table;
   var result = ["EXEC sp_rename '"+
     self.visit(table.toNode())+'.'+self.visit(alter.nodes[0].nodes[0])+"', "+
     self.visit(alter.nodes[0].nodes[1])+', '+
     "'COLUMN'"
     ];
   self._visitingAlter = false;
   return result;
  }

  if (isAlterAddColumn(alter)) return _addColumn();
  if (isAlterDropColumn(alter)) return _dropColumn();
  if (isAlterRename(alter)) return _rename();
  if (isAlterRenameColumn(alter)) return _renameColumn();
  return Mssql.super_.prototype.visitAlter.call(this, alter);
};

// Need to implement a special version of CASE since SQL doesn't support
//   CASE WHEN true THEN xxx END
//   the "true" has to be a boolean expression like 1=1
Mssql.prototype.visitCase = function(caseExp) {
  var _this=this;

  function _whenValue(node){
    if (node.type!='PARAMETER') return _this.visit(node);
    // dealing with a true/false value
    var val=node.value();
    if (val===true) return '1=1'; else return '0=1';
  }

  assert(caseExp.whenList.length == caseExp.thenList.length);

  var self = this;
  var text = '(CASE';

  this.visitingCase = true;

  for (var i = 0; i < caseExp.whenList.length; i++) {
    var whenExp = ' WHEN ' + _whenValue(caseExp.whenList[i]);
    var thenExp = ' THEN ' + this.visit(caseExp.thenList[i]);
    text += whenExp + thenExp;
  }

  if (null !== caseExp.else && undefined !== caseExp.else) {
    text += ' ELSE ' + this.visit(caseExp.else);
  }

  this.visitingCase = false;

  text += ' END)';
  return [text];
};

Mssql.prototype.visitColumn = function(columnNode) {
  var self=this;
  var table;
  var inSelectClause;

  function _arrayAgg(){
    throw new Error("SQL Server does not support array_agg.");
  }

  function _countStar(){
    // Implement our own since count(table.*) is invalid in Mssql
    var result='COUNT(*)';
    if(inSelectClause && columnNode.alias) {
      result += ' AS ' + self.quote(columnNode.alias);
    }
    return result;
  }

  table = columnNode.table;
  inSelectClause = !this._selectOrDeleteEndIndex;
  if (isCountStarExpression(columnNode)) return _countStar();
  if (inSelectClause && table && !table.alias && columnNode.asArray) return _arrayAgg();
  return Mssql.super_.prototype.visitColumn.call(this, columnNode);

};


Mssql.prototype.visitCreate = function(create) {
  var isNotExists=isCreateIfNotExists(create);
  var isTemporary=isCreateTemporary(create);
  if (!isNotExists && !isTemporary) {
    return Mssql.super_.prototype.visitCreate.call(this, create);
  }
  // Implement our own create if not exists:
  //   PostgreSQL: CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100))
  //   Mssql:  IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'group') BEGIN ... END
  var table = this._queryNode.table;
  var col_nodes = table.columns.map(function(col) { return col.toNode(); });
  var tableResult=this.visit(table.toNode());

  this._visitingCreate = true;
  var createResult = ['CREATE TABLE'];
  createResult.push(tableResult);
  createResult.push('(' + col_nodes.map(this.visit.bind(this)).join(', ') + ')');
  this._visitingCreate = false;

  var tableStr=tableResult.join(' ');
  tableStr=tableStr.replace("'","''");
  tableStr="'"+tableStr.substring(1,tableStr.length-1)+"'";
  var whereClause='WHERE TABLE_NAME = '+tableStr;
  // TODO: need to add schema check, sudo code:
  // if (schema) { whereClause+=' AND TABLE_SCHEMA = schemaResult.join(' ')}
  // Add some tests for this as well

  if (!isNotExists) return createResult;
  return ['IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES '+whereClause+') BEGIN '+createResult.join(' ')+' END'];
};

Mssql.prototype.visitDrop = function(drop) {
  if (!isDropIfExists(drop)) {
    return Mssql.super_.prototype.visitDrop.call(this, drop);
  }
  // Implement our own drop if exists:
  //   PostgreSQL: DROP TABLE IF EXISTS "group"
  //   Mssql:  IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [group]) BEGIN ... END
  var table = this._queryNode.table;
  var tableResult=this.visit(table.toNode());

  var dropResult = ['DROP TABLE'];
  dropResult.push(tableResult);

  var whereClause='WHERE TABLE_NAME = '+tableResult.join(' ');
  // TODO: need to add schema check, sudo code:
  // if (schema) { whereClause+=' AND TABLE_SCHEMA = schemaResult.join(' ')}
  // Add some tests for this as well

  return ['IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES '+whereClause+') BEGIN '+dropResult.join(' ')+' END'];
};

Mssql.prototype.visitFunctionCall = function(functionCall) {
  this._visitingFunctionCall = true;
  var _this = this;

  function _extract() {
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 1) throw new Error('Not enough parameters passed to ' + functionCall.name + ' function');
    var txt = 'DATEPART(' + functionCall.name.toLowerCase() + ', ' + (nodes[0]+'') + ')';
    return txt;
  }

  var txt;
  // Override date functions since mssql uses datepart
  if (['YEAR', 'MONTH', 'DAY', 'HOUR'].indexOf(functionCall.name) >= 0) txt = _extract();
  // Override CURRENT_TIMESTAMP function to remove parens
  else if ('CURRENT_TIMESTAMP' == functionCall.name) txt = functionCall.name;
  else {
    var name = functionCall.name;
    // override the LENGTH function since mssql calls it LEN
    if (name == "LENGTH") name = "LEN";
    txt = name + '(' + functionCall.nodes.map(this.visit.bind(this)).join(', ') + ')';
  }
  this._visitingFunctionCall = false;
  return [txt];
};

Mssql.prototype.visitOrderBy = function(orderBy) {
  var result=Mssql.super_.prototype.visitOrderBy.call(this, orderBy);
  var offsetNode=orderBy.msSQLOffsetNode;
  var limitNode=orderBy.msSQLLimitNode;
  if (!offsetNode && !limitNode) return result;
  assert(offsetNode,"Something bad happened, should have had an msSQLOffsetNode here.");
  result.push("OFFSET "+getModifierValue(this,offsetNode)+" ROWS");
  if (!limitNode) return result;
  result.push("FETCH NEXT "+getModifierValue(this,limitNode)+" ROWS ONLY");
  return result;
};

/**
 * We override this so that we can deal with the LIMIT and OFFSET clauses specially since they have to become
 * part of the SELECT and ORDER BY clauses.
 *
 * Basically if there's an ORDER BY clause we attach OFFSET and LIMIT to it so that it can be processed by the
 * ORDER BY handler later.
 *
 * If there's a LIMIT clause without OFFSET, we attach it to the SELECT clause so we can process it later.
 *
 * @param {Node[]} actions
 * @param {Node[]} targets
 * @param {Node[]} filters
 * @returns {String[]}
 */
Mssql.prototype.visitQueryHelper=function(actions,targets,filters){
  function _handleLimitAndOffset(){
    var limitInfo=Mssql.super_.prototype.findNode.call(this, filters, "LIMIT"); // jshint ignore:line
    var offsetInfo=Mssql.super_.prototype.findNode.call(this, filters, "OFFSET"); // jshint ignore:line
    var orderByInfo=Mssql.super_.prototype.findNode.call(this, filters, "ORDER BY"); // jshint ignore:line

    // no OFFSET or LIMIT then there's nothing special to do
    if (!offsetInfo && !limitInfo) return;
    // ORDER BY with OFFSET we have work to do, may consume LIMIT as well
    if (orderByInfo && offsetInfo) _processOrderByOffsetLimit(orderByInfo,offsetInfo,limitInfo);
    else if (offsetInfo) throw new Error("MS SQL Server does not allow OFFSET without ORDER BY");
    else if (limitInfo) _processLimit(limitInfo);
  }

  /**
   * We need to turn LIMIT into a TOP clause on the SELECT STATEMENT
   *
   * @param limitInfo
   * @private
   */
  function _processLimit(limitInfo){
    var selectInfo=Mssql.super_.prototype.findNode.call(this, actions, "SELECT"); // jshint ignore:line
    assert(selectInfo!==undefined,"MS SQL Server requires a SELECT clause when using LIMIT");
    // save the LIMIT node with the SELECT node
    selectInfo.node.msSQLLimitNode=limitInfo.node;
    // remove the LIMIT node from the filters so it doesn't get processed later.
    filters.splice(limitInfo.index,1);
  }

  /**
   * We need to turn LIMIT into a TOP clause on the SELECT STATEMENT
   *
   * @param orderByInfo
   * @param offsetInfo
   * @param limitInfo
   * @private
   */
  function _processOrderByOffsetLimit(orderByInfo,offsetInfo,limitInfo){
    // save the OFFSET AND LIMIT nodes with the ORDER BY node
    orderByInfo.node.msSQLOffsetNode=offsetInfo.node;
    if (limitInfo) orderByInfo.node.msSQLLimitNode=limitInfo.node;
    // remove the OFFSET and LIMIT nodes from the filters so they don't get processed later.
    filters.splice(offsetInfo.index,1);
    if (limitInfo) filters.splice(limitInfo.index,1);
  }

  // MAIN

  Mssql.super_.prototype.handleDistinct.call(this, actions, filters);
  _handleLimitAndOffset();

  // lazy-man sorting
  var sortedNodes = actions.concat(targets).concat(filters);
  for(var i = 0; i < sortedNodes.length; i++) {
    var res = this.visit(sortedNodes[i]);
    this.output = this.output.concat(res);
  }
  return this.output;
};

//Mysql.prototype.visitRenameColumn = function(renameColumn) {
//  var dataType = renameColumn.nodes[1].dataType || renameColumn.nodes[0].dataType;
//  assert(dataType, 'dataType missing for column ' + (renameColumn.nodes[1].name || renameColumn.nodes[0].name || '') +
//    ' (CHANGE COLUMN statements require a dataType)');
//  return ['CHANGE COLUMN ' + this.visit(renameColumn.nodes[0]) + ' ' + this.visit(renameColumn.nodes[1]) + ' ' + dataType];
//};
//
//Mysql.prototype.visitInsert = function(insert) {
//  var result = Postgres.prototype.visitInsert.call(this, insert);
//  if (result[2] === 'DEFAULT VALUES') {
//    result[2] = '() VALUES ()';
//  }
//  return result;
//};
//
//Mysql.prototype.visitIndexes = function(node) {
//  var tableName = this.visit(this._queryNode.table.toNode());
//
//  return "SHOW INDEX FROM " + tableName;
//};

Mssql.prototype.visitOnDuplicate = function(onDuplicate) {
  throw new Error('MSSQL does not allow onDuplicate clause.');
};

Mssql.prototype.visitOnConflict = function(onConflict) {
  throw new Error('MSSQL does not allow onConflict clause.');
};

Mssql.prototype.visitReturning = function() {
  // TODO: need to add some code to the INSERT clause to support this since its the equivalent of the OUTPUT clause
  // in MS SQL which appears before the values, not at the end of the statement.
  throw new Error('Returning clause is not yet supported for MS SQL.');
};

// We deal with SELECT specially so we can add the TOP clause if needed
Mssql.prototype.visitSelect = function(select) {
  if (!select.msSQLLimitNode) return Mssql.super_.prototype.visitSelect.call(this, select);
  var result=[
    'SELECT',
    'TOP('+getModifierValue(this,select.msSQLLimitNode)+')',
    select.nodes.map(this.visit.bind(this)).join(', ')
  ];
  this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

// Node is either an OFFSET or LIMIT node
function getModifierValue(dialect,node){
  return node.count.type ? dialect.visit(node.count) : node.count;
}

function isAlterAddColumn(alter){
  if (alter.nodes.length===0) return false;
  if (alter.nodes[0].type!='ADD COLUMN') return false;
  return true;
}

function isAlterDropColumn(alter){
  if (alter.nodes.length===0) return false;
  if (alter.nodes[0].type!='DROP COLUMN') return false;
  return true;
}

function isAlterRename(alter){
  if (alter.nodes.length===0) return false;
  if (alter.nodes[0].type!='RENAME') return false;
  return true;
}

function isAlterRenameColumn(alter){
  if (alter.nodes.length===0) return false;
  if (alter.nodes[0].type!='RENAME COLUMN') return false;
  return true;
}

function isCountStarExpression(columnNode){
  if (!columnNode.aggregator) return false;
  if (columnNode.aggregator.toLowerCase()!='count') return false;
  if (!columnNode.star) return false;
  return true;
}

function isCreateIfNotExists(create){
  if (create.nodes.length===0) return false;
  if (create.nodes[0].type!='IF NOT EXISTS') return false;
  return true;
}

function isCreateTemporary(create){
  return create.options.isTemporary;
}

function isDropIfExists(drop){
  if (drop.nodes.length===0) return false;
  if (drop.nodes[0].type!='IF EXISTS') return false;
  return true;
}

// SQL Server does not support array expressions except in the IN clause.
function isRightSideArray(binary){
  return Array.isArray(binary.right);
}

module.exports = Mssql;
