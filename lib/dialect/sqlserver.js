// TODO: visitCreate needs to support schemas
// TODO: visitDrop needs to support schemas

'use strict';

var util = require('util');
var assert = require('assert');

var SqlServer = function() {
  this.output = [];
  this.params = [];
};

var Postgres = require(__dirname + '/postgres');

util.inherits(SqlServer, Postgres);

SqlServer.prototype._myClass = SqlServer;

SqlServer.prototype._quoteCharacter = '[';

SqlServer.prototype._arrayAggFunctionName = '';

SqlServer.prototype._getParameterPlaceholder = function(index, value) {
  return '?';
};

SqlServer.prototype.visitBinary = function(binary) {
  if (!isRightSideArray(binary)){
    return SqlServer.super_.prototype.visitBinary.call(this, binary);
  }
  if (binary.operator=='IN'){
    return SqlServer.super_.prototype.visitBinary.call(this, binary);
  }
  throw new Error('SQL Sever does not support arrays in this type of expression.');
};

SqlServer.prototype.visitAlter = function(alter) {
  var self=this;
  var errMsg='ALTER TABLE cannot be used to perform multiple different operations in the same statement.';

  // Implement our own add column:
  //   PostgreSQL: ALTER TABLE "name" ADD COLUMN "col1", ADD COLUMN "col2"
  //   SqlServer:  ALTER TABLE [name] ADD [col1], [col2]
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
  //   SqlServer:  ALTER TABLE [name] DROP COLUMN [col1], [col2]
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
  //   SqlServer:  EXEC sp_rename [post], [posts]
  function _rename(){
    self._visitingAlter = true;
    var table = self._queryNode.table;
    var result = ['EXEC sp_rename '+self.visit(table.toNode())+', '+self.visit(alter.nodes[0].nodes[0])];
    self._visitingAlter = false;
    return result
  }

  // Implement our own rename column:
  //   PostgreSQL: ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"
  //   SqlServer:  EXEC sp_rename [group], [userId], [newUserId]
  function _renameColumn(){
    // TODO: implement this. Need to be able to get the [tableName.Column], which is hard to do with the current way visitXxx works
    throw new Error('SqlServer renaming columns not yet implemented');
//    self._visitingAlter = true;
//    var table = self._queryNode.table;
//    var result = ['EXEC sp_rename '+
//      self.visit(table.toNode())+'.'+self.visit(alter.nodes[0].nodes[0])+', '+
//      self.visit(alter.nodes[0].nodes[1])+', '+
//      "'COLUMN'"
//      ];
//    self._visitingAlter = false;
//    return result
  }

  if (isAlterAddColumn(alter)) return _addColumn();
  if (isAlterDropColumn(alter)) return _dropColumn();
  if (isAlterRename(alter)) return _rename();
  if (isAlterRenameColumn(alter)) return _renameColumn();
  return SqlServer.super_.prototype.visitAlter.call(this, alter);
};

SqlServer.prototype.visitColumn = function(columnNode) {
  var self=this;
  var table;
  var inSelectClause;

  function _arrayAgg(){
    throw new Error("SQL Server does not support array_agg.")
  }

  function _countStar(){
    // Implement our own since count(table.*) is invalid in SqlServer
    var result='COUNT(*)'
    if(inSelectClause && columnNode.alias) {
      result += ' AS ' + self.quote(columnNode.alias);
    }
    return result;
  }

  table = columnNode.table;
  inSelectClause = !this._selectOrDeleteEndIndex;
  if (isCountStarExpression(columnNode)) return _countStar();
  if (inSelectClause && !table.alias && columnNode.asArray) return _arrayAgg();
  return SqlServer.super_.prototype.visitColumn.call(this, columnNode);
  
};


SqlServer.prototype.visitCreate = function(create) {
  if (!isCreateIfNotExists(create)) {
    return SqlServer.super_.prototype.visitCreate.call(this, create);
  }
  // Implement our own create if not exists:
  //   PostgreSQL: CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100))
  //   SqlServer:  IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [group]) BEGIN ... END
  var table = this._queryNode.table;
  var col_nodes = table.columns.map(function(col) { return col.toNode(); });
  var tableResult=this.visit(table.toNode());

  this._visitingCreate = true;
  var createResult = ['CREATE TABLE'];
  createResult.push(tableResult);
  createResult.push('(' + col_nodes.map(this.visit.bind(this)).join(', ') + ')');
  this._visitingCreate = false;

  var whereClause='WHERE TABLE_NAME = '+tableResult.join(' ');
  // TODO: need to add schema check, sudo code:
  // if (schema) { whereClause+=' AND TABLE_SCHEMA = schemaResult.join(' ')}
  // Add some tests for this as well

  return ['IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES '+whereClause+') BEGIN '+createResult.join(' ')+' END'];
};

SqlServer.prototype.visitDrop = function(drop) {
  if (!isDropIfExists(drop)) {
    return SqlServer.super_.prototype.visitDrop.call(this, drop);
  }
  // Implement our own drop if exists:
  //   PostgreSQL: DROP TABLE IF EXISTS "group"
  //   SqlServer:  IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [group]) BEGIN ... END
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

function isAlterAddColumn(alter){
  if (alter.nodes.length==0) return false;
  if (alter.nodes[0].type!='ADD COLUMN') return false;
  return true;
};

function isAlterDropColumn(alter){
  if (alter.nodes.length==0) return false;
  if (alter.nodes[0].type!='DROP COLUMN') return false;
  return true;
};

function isAlterRename(alter){
  if (alter.nodes.length==0) return false;
  if (alter.nodes[0].type!='RENAME') return false;
  return true;
};

function isAlterRenameColumn(alter){
  if (alter.nodes.length==0) return false;
  if (alter.nodes[0].type!='RENAME COLUMN') return false;
  return true;
};

function isCountStarExpression(columnNode){
  if (!columnNode.aggregator) return false;
  if (columnNode.aggregator.toLowerCase()!='count') return false;
  if (!columnNode.star) return false;
  return true;
};

function isCreateIfNotExists(create){
  if (create.nodes.length==0) return false;
  if (create.nodes[0].type!='IF NOT EXISTS') return false;
  return true;
};

function isDropIfExists(drop){
  if (drop.nodes.length==0) return false;
  if (drop.nodes[0].type!='IF EXISTS') return false;
  return true;
};

// SQL Server does not support array expressions except in the IN clause.
function isRightSideArray(binary){
  return Array.isArray(binary.right);
};

module.exports = SqlServer;
