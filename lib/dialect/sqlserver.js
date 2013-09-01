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
	var result = Postgres.prototype.visitColumn.call(this, columnNode);
	return result;
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
//
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

module.exports = SqlServer;
