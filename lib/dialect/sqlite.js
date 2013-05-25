'use strict';

var util = require('util');
var assert = require('assert');

var Sqlite = function() {
  this.output = [];
  this.params = [];
  this._hasAddedAColumn = false;
};

var Postgres = require(__dirname + '/postgres');

util.inherits(Sqlite, Postgres);

Sqlite.prototype._myClass = Sqlite;

Sqlite.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

/*jshint unused: false */
Sqlite.prototype.visitDefault = function(parameter) {
  throw new Error('SQLite requires that all rows of a multi-row insert are for the same columns.');
};

/*jshint unused: false */
Sqlite.prototype.visitDropColumn = function(dropColumn) {
  throw new Error('SQLite does not allow dropping columns.');
};

/*jshint unused: false */
Sqlite.prototype.visitRenameColumn = function(renameColumn) {
  throw new Error('SQLite does not allow renaming columns.');
};

Sqlite.prototype.visitAddColumn = function(addColumn) {
  assert(!this._hasAddedAColumn, 'SQLite can not add more that one column at a time');
  var result = Postgres.prototype.visitAddColumn.call(this, addColumn);
  this._hasAddedAColumn = true;
  return result;
};

Sqlite.prototype.visitIndexes = function(node) {
  var tableName = this.visit(this._queryNode.table.toNode());
  return "PRAGMA INDEX_LIST(" + tableName + ")";
};

module.exports = Sqlite;
