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

Sqlite.prototype._getParameterValue = function(value) {
  if (Buffer.isBuffer(value)) {
    value = 'x' + this._getParameterValue(value.toString('hex'));
  } else {
    value = Postgres.prototype._getParameterValue.call(this, value);
  }
  return value;
};

Sqlite.prototype.visitDefault = function() {
  throw new Error('SQLite requires that all rows of a multi-row insert are for the same columns.');
};

Sqlite.prototype.visitDropColumn = function() {
  throw new Error('SQLite does not allow dropping columns.');
};

Sqlite.prototype.visitRenameColumn = function() {
  throw new Error('SQLite does not allow renaming columns.');
};

Sqlite.prototype.visitReturning = function() {
  throw new Error('SQLite does not allow returning clause.');
};

Sqlite.prototype.visitForUpdate = function() {
  throw new Error('SQLite does not allow FOR UPDATE clause.');
};

Sqlite.prototype.visitForShare = function() {
  throw new Error('SQLite does not allow FOR SHARE clause.');
};

Sqlite.prototype.visitAddColumn = function(addColumn) {
  assert(!this._hasAddedAColumn, 'SQLite can not add more that one column at a time');
  var result = Postgres.prototype.visitAddColumn.call(this, addColumn);
  this._hasAddedAColumn = true;
  return result;
};

Sqlite.prototype.visitIndexes = function(node) {
  var tableName = this.visit(this._queryNode.table.toNode())[0];
  return "PRAGMA INDEX_LIST(" + tableName + ")";
};

Sqlite.prototype.visitCascade = function() {
  throw new Error('Sqlite do not support CASCADE in DROP TABLE');
};

Sqlite.prototype.visitRestrict = function() {
  throw new Error('Sqlite do not support RESTRICT in DROP TABLE');
};

module.exports = Sqlite;
