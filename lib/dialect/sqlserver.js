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

SqlServer.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

/* jshint unused: false */
SqlServer.prototype._getParameterPlaceholder = function(index, value) {
  return '?';
};

/*jshint unused: false */
SqlServer.prototype.visitColumn = function(columnNode) {
	if (!isCountStarExpression(columnNode)){
	  return SqlServer.super_.prototype.visitColumn.call(this, columnNode);
  }
  // emit our own since count(table.*) is invalid in SqlServer
  var inSelectClause = !this._selectOrDeleteEndIndex;
  var result='COUNT(*)'
  if(inSelectClause && columnNode.alias) {
    result += ' AS ' + this.quote(columnNode.alias);
  }
  return result;
};

SqlServer.prototype.visitAlter = function(alter) {
  var _this=this;
  var errMsg='ALTER TABLE cannot be used to perform multiple different operations in the same statement.';

  // Implement our own add column:
  //   PostgreSQL: ALTER TABLE "name" ADD COLUMN "col1", ADD COLUMN "col2"
  //   SqlServer:  ALTER TABLE [name] ADD [col1], [col2]
  function addColumn(){
    _this._visitingAlter = true;
    var table = _this._queryNode.table;
    _this._visitingAddColumn = true;
    var result='ALTER TABLE '+_this.visit(table.toNode())+' ADD '+_this.visit(alter.nodes[0].nodes[0]);
    for (var i= 1,len=alter.nodes.length; i<len; i++){
      var node=alter.nodes[i];
      assert(node.type=='ADD COLUMN',errMsg);
      result+=', '+_this.visit(node.nodes[0]);
    }
    _this._visitingAddColumn = false;
    _this._visitingAlter = false;
    return [result];
  }

  // Implement our own drop column:
  //   PostgreSQL: ALTER TABLE "name" DROP COLUMN "col1", DROP COLUMN "col2"
  //   SqlServer:  ALTER TABLE [name] DROP COLUMN [col1], [col2]
  function dropColumn(){
    _this._visitingAlter = true;
    var table = _this._queryNode.table;
    var result=[
      'ALTER TABLE',
      _this.visit(table.toNode())
    ];
    var columns='DROP COLUMN '+_this.visit(alter.nodes[0].nodes[0]);
    for (var i= 1,len=alter.nodes.length; i<len; i++){
      var node=alter.nodes[i];
      assert(node.type=='DROP COLUMN',errMsg);
      columns+=', '+_this.visit(node.nodes[0]);
    }
    result.push(columns);
    _this._visitingAlter = false;
    return result;
  }

  // Implement our own rename table:
  //   PostgreSQL: ALTER TABLE "post" RENAME TO "posts"
  //   SqlServer:  EXEC sp_rename [post], [posts]
  function rename(){
    _this._visitingAlter = true;
    var table = _this._queryNode.table;
    var result = ['EXEC sp_rename '+_this.visit(table.toNode())+', '+_this.visit(alter.nodes[0].nodes[0])];
    _this._visitingAlter = false;
    return result
  }

  // Implement our own rename column:
  //   PostgreSQL: ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"
  //   SqlServer:  EXEC sp_rename [group], [userId], [newUserId]
  function renameColumn(){
    // TODO: implement this. Need to be able to get the [tableName.Column], which is hard to do with the current way visitXxx works
    throw new Error('SqlServer renaming columns not yet implemented');
//    _this._visitingAlter = true;
//    var table = _this._queryNode.table;
//    var result = ['EXEC sp_rename '+
//      _this.visit(table.toNode())+'.'+_this.visit(alter.nodes[0].nodes[0])+', '+
//      _this.visit(alter.nodes[0].nodes[1])+', '+
//      "'COLUMN'"
//      ];
//    _this._visitingAlter = false;
//    return result
  }

  if (isAlterAddColumn(alter)) return addColumn();
  if (isAlterDropColumn(alter)) return dropColumn();
  if (isAlterRename(alter)) return rename();
  if (isAlterRenameColumn(alter)) return renameColumn();
  return SqlServer.super_.prototype.visitAlter.call(this, alter);
};

//Mysql.prototype.visitCreate = function(create) {
//  var result = Mysql.super_.prototype.visitCreate.call(this, create);
//  var engine = this._queryNode.table._initialConfig.engine;
//  var charset = this._queryNode.table._initialConfig.charset;
//
//  if ( !! engine) {
//    result.push('ENGINE=' + engine);
//  }
//
//  if ( !! charset) {
//    result.push('DEFAULT CHARSET=' + charset);
//  }
//
//  return result;
//};

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

module.exports = SqlServer;
