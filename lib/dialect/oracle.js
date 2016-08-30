'use strict';

var util = require('util');
var assert = require('assert');

var Oracle = function(config) {
  this.output = [];
  this.params = [];
  this.config = config || {};
};

var Postgres = require(__dirname + '/postgres');

var Mssql = require(__dirname + '/mssql');

util.inherits(Oracle, Postgres);

Oracle.prototype._myClass = Oracle;

Oracle.prototype._aliasText = ' ';
Oracle.prototype._getParameterPlaceholder = function(index, value) {
  /* jshint unused: false */
  return ':' + index;
};

Oracle.prototype.visitAlias = function(alias) {
  var result = [this.visit(alias.value) + ' ' + this.quote(alias.alias)];
  return result;
};

Oracle.prototype.visitTable = function(tableNode) {
  var table = tableNode.table;
  var txt="";
  if(table.getSchema()) {
    txt = this.quote(table.getSchema());
    txt += '.';
  }
  txt += this.quote(table.getName());
  if(table.alias) {
    txt += ' ' + this.quote(table.alias);
  }
  return [txt];
};

Oracle.prototype.visitCascade = function() {
  return ['CASCADE CONSTRAINTS'];
};

Oracle.prototype.visitRestrict = function() {
  throw new Error('Oracle do not support RESTRICT in DROP TABLE');
};

Oracle.prototype.visitDrop = function(drop) {
  if (!isDropIfExists(drop)) {
    return Oracle.super_.prototype.visitDrop.call(this, drop);
  }
  // Implement our own drop if exists:
  //   PostgreSQL: DROP TABLE IF EXISTS "group"
  //   Oracle:
  //     BEGIN
  //          EXECUTE IMMEDIATE 'DROP TABLE POST';
  //     EXCEPTION
  //          WHEN OTHERS THEN
  //                 IF SQLCODE != -942 THEN
  //                      RAISE;
  //                 END IF;
  //     END;
  var table = this._queryNode.table;
  var tableResult=this.visit(table.toNode());

  var dropResult = ['DROP TABLE'];
  dropResult.push(tableResult);

  return ["BEGIN EXECUTE IMMEDIATE '"+dropResult.join(' ')+"'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF; END;"];
};

Oracle.prototype.visitCreate = function(create) {
  var isNotExists=isCreateIfNotExists(create);
  //var isTemporary=isCreateTemporary(create)
  var createText = Oracle.super_.prototype.visitCreate.call(this, create);
  if (isNotExists) {
      // Implement our own create if not exists:
      //   PostgreSQL: CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100))
      //   Oracle:
      //     BEGIN
      //          EXECUTE IMMEDIATE 'CREATE TABLE ...';
      //     EXCEPTION
      //          WHEN OTHERS THEN
      //                 IF SQLCODE != -955 THEN
      //                      RAISE;
      //                 END IF;
      //     END;

    createText = "BEGIN EXECUTE IMMEDIATE '"+createText.join(' ').replace(' IF NOT EXISTS','')+"'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF; END;";
  }

  return createText;
};

Oracle.prototype.visitBinary = function(binary) {
  if(binary.operator === '@@'){
    var self = this;
    var text = '(INSTR (' + this.visit(binary.left) + ', ';
    text += this.visit(binary.right);
    text += ') > 0)';
    return [text];
  }

  if (!isRightSideArray(binary)){
    return Oracle.super_.prototype.visitBinary.call(this, binary);
  }
  if (binary.operator=='IN' || binary.operator=='NOT IN'){
    return Oracle.super_.prototype.visitBinary.call(this, binary);
  }
  throw new Error('Oracle does not support arrays in this type of expression.');
};

Oracle.prototype.visitModifier = function(node) {
  var ret = Oracle.super_.prototype.visitModifier.call(this, node);
  if (ret.indexOf('OFFSET') >= 0) {
    ret.push('ROWS');
  }
  if (ret.indexOf('LIMIT') >= 0) {
    ret[0] = 'FETCH NEXT';
    ret.push('ROWS ONLY');
  }
  return ret;
};

Oracle.prototype.visitQueryHelper=function(actions,targets,filters){
  var output = Oracle.super_.prototype.visitQueryHelper.call(this,actions,targets,filters);

  //In Oracle, OFFSET must come before FETCH NEXT (limit)
  //Change positions, if both are present and not done already
  var offset = output.indexOf('OFFSET');
  var limit = output.indexOf('FETCH NEXT');
  if (offset != -1 && limit != -1 && offset > limit){
    var temp = [output[offset], output[offset+1], output[offset+2]];
    output[offset] = output[limit];
    output[offset+1] = output[limit+1];
    output[offset+2] = output[limit+2];
    output[limit] = temp[0];
    output[limit+1] = temp[1];
    output[limit+2] = temp[2];
  }

  return this.output;
};

Oracle.prototype.visitColumn = function(columnNode) {
  var self=this;
  var table;
  var inSelectClause;

  function _arrayAgg(){
    throw new Error("Oracle does not support array_agg.");
  }

  function _countStar(){
    // Implement our own since count(table.*) is invalid in Oracle
    var result='COUNT(*)';
    if(inSelectClause && columnNode.alias) {
      result += self._aliasText + self.quote(columnNode.alias);
    }
    return result;
  }

  table = columnNode.table;
  inSelectClause = !this._selectOrDeleteEndIndex;
  if (isCountStarExpression(columnNode)) return _countStar();
  if (inSelectClause && table && !table.alias && columnNode.asArray) return _arrayAgg();
  return Oracle.super_.prototype.visitColumn.call(this, columnNode);
};


Oracle.prototype.visitReturning = function() {
  // TODO: need to add some code to the INSERT clause to support this since its the equivalent of the OUTPUT clause
  // in MS SQL which appears before the values, not at the end of the statement.
  throw new Error('Returning clause is not yet supported for Oracle.');
};


Oracle.prototype._getParameterValue = function(value) {
  if (Buffer.isBuffer(value)) {
    value = "utl_raw.cast_to_varchar2(hextoraw('" + value.toString('hex') + "'))";
  } else {
    value = Oracle.super_.prototype._getParameterValue.call(this, value);
    //value = Postgres.prototype._getParameterValue.call(this, value);
  }
  return value;
};


Oracle.prototype.visitIndexes = function(node) {

  var tableName = this._queryNode.table.getName();
  var schemaName = this._queryNode.table.getSchema();

  var indexes = "SELECT * FROM USER_INDEXES WHERE TABLE_NAME = '" + tableName + "'";

  if (schemaName) {
    indexes += " AND TABLE_OWNER = '" + schemaName + "'";
  }

  return indexes;
};


Oracle.prototype.visitDropIndex = function(node) {
  var result = [ 'DROP INDEX' ];
  var schemaName = node.table.getSchema();
  if (schemaName) {
    result.push(this.quote(schemaName) + ".");
  }

  result.push(this.quote(node.options.indexName));

  return result;
};

// Using same CASE implementation as MSSQL
Oracle.prototype.visitCase = function(caseExp) {

  return Mssql.prototype.visitCase.call(this, caseExp);
};


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

function isCountStarExpression(columnNode){
  if (!columnNode.aggregator) return false;
  if (columnNode.aggregator.toLowerCase()!='count') return false;
  if (!columnNode.star) return false;
  return true;
}

module.exports = Oracle;
