'use strict';

var _ = require('lodash');
var util = require('util');
var assert = require('assert');

var Sqlite = function(config) {
  this.output = [];
  this.params = [];
  this._hasAddedAColumn = false;
  this.config = config || {};
};

var Postgres = require(__dirname + '/postgres');

util.inherits(Sqlite, Postgres);

Sqlite.prototype._myClass = Sqlite;

Sqlite.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Sqlite.prototype._getParameterValue = function(value) {
  if (Buffer.isBuffer(value)) {
    value = 'x' + this._getParameterValue(value.toString('hex'));
  } else if (value instanceof Date && this.config.dateTimeMillis) {
    value = value.getTime();
  } else if('boolean' === typeof value) {
    value = value ? 1 : 0;
  } else if(_.isArray(value)) {
    value = Postgres.prototype._getParameterValue.call(this, JSON.stringify(value));
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

Sqlite.prototype.visitFunctionCall = function(functionCall) {
  var _this=this;

    this._visitingFunctionCall = true;

  function _left() {
    // convert LEFT(column,4) to SUBSTR(column,1,4)
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 2) throw new Error('Not enough parameters passed to LEFT function.');
    var txt = "SUBSTR(" + (nodes[0]+'') + ', 1, ' + (nodes[1]+'') + ')';
    return txt;
  }

  function _right() {
    // convert RIGHT(column,4) to SUBSTR(column,-4)
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 2) throw new Error('Not enough parameters passed to RIGHT function.');
    var txt = "SUBSTR(" + (nodes[0]+'') + ', -' + (nodes[1]+'') + ')';
    return txt;
  }

  var txt="";
  var name=functionCall.name;
  // Override LEFT and RIGHT and convert to SUBSTR
  if (name == "LEFT") txt = _left();
  else if (name == "RIGHT") txt = _right();
  else txt = name + '(' + functionCall.nodes.map(this.visit.bind(this)).join(', ') + ')';

    this._visitingFunctionCall = false;
  return [txt];
};

Sqlite.prototype.visitTruncate = function(truncate) {
  var result = ['DELETE FROM'];
  result = result.concat(truncate.nodes.map(this.visit.bind(this)));
  return result;
};

Sqlite.prototype.visitRenameColumn = function() {
  throw new Error('SQLite does not allow renaming columns.');
};

Sqlite.prototype.visitOnDuplicate = function() {
  throw new Error('SQLite does not allow onDuplicate clause.');
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

Sqlite.prototype.visitBinary = function(binary) {
  if(binary.operator === '@@'){
    binary.operator = 'MATCH';
    var ret = Sqlite.super_.prototype.visitBinary.call(this, binary);
    binary.operator = '@@';
    return ret;
  }
  return Sqlite.super_.prototype.visitBinary.call(this, binary);
};

module.exports = Sqlite;
