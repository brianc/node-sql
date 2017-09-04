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

var Postgres = require('./postgres');

util.inherits(Sqlite, Postgres);

Sqlite.prototype._myClass = Sqlite;

Sqlite.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Sqlite.prototype.visitReplace = function(replace) {
  var self = this;
  // don't use table.column for replaces
  this._visitedReplace = true;

  var result = ['REPLACE'];
  result = result.concat(replace.nodes.map(this.visit.bind(this)));
  result.push('INTO ' + this.visit(this._queryNode.table.toNode()));
  result.push('(' + replace.columns.map(this.visit.bind(this)).join(', ') + ')');

  var paramNodes = replace.getParameters();

  if (paramNodes.length > 0) {
    var paramText = paramNodes.map(function (paramSet) {
        return paramSet.map(function (param) {
          return self.visit(param);
        }).join(', ');
      }).map(function (param) {
        return '('+param+')';
      }).join(', ');

    result.push('VALUES', paramText);

    if (result.slice(2, 5).join(' ') === '() VALUES ()') {
      result.splice(2, 3, 'DEFAULT VALUES');
    }
  }

  this._visitedReplace = false;

  return result;
};

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

Sqlite.prototype.visitFunctionCall = function (functionCall) {
  var _this = this;

  this._visitingFunctionCall = true;

  function _left() {
    // convert LEFT(column,4) to SUBSTR(column,1,4)
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 2) throw new Error('Not enough parameters passed to LEFT function.');
    var txt = "SUBSTR(" + (nodes[0] + '') + ', 1, ' + (nodes[1] + '') + ')';
    return txt;
  }

  function _right() {
    // convert RIGHT(column,4) to SUBSTR(column,-4)
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 2) throw new Error('Not enough parameters passed to RIGHT function.');
    var txt = "SUBSTR(" + (nodes[0] + '') + ', -' + (nodes[1] + '') + ')';
    return txt;
  }

  function _extract() {
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 1) throw new Error('Not enough parameters passed to ' + functionCall.name + ' function');
    var format;
    switch (functionCall.name) {
      case 'YEAR':
        format = "'%Y'";
        break;
      case 'MONTH':
        format = "'%m'";
        break;
      case 'DAY':
        format = "'%d'";
        break;
      case 'HOUR':
        format = "'%H'";
        break;
    }
    var col = (nodes[0] + '');
    if (_this.config.dateTimeMillis) {
      // Convert to a datetime before running the strftime function
      // Sqlite unix epoch is in seconds, but javascript is milliseconds.
      col = 'datetime(' + col + '/1000, "unixepoch")';
    }
    var txt = 'strftime(' + format + ', ' + col + ')';
    return txt;
  }

  var txt = "";
  var name = functionCall.name;
  // Override LEFT and RIGHT and convert to SUBSTR
  if (name == "LEFT") txt = _left();
  else if (name == "RIGHT") txt = _right();
  // Override date functions since sqlite uses strftime
  else if (['YEAR', 'MONTH', 'DAY', 'HOUR'].indexOf(functionCall.name) >= 0) txt = _extract();
  else if ('CURRENT_TIMESTAMP' == functionCall.name) txt = functionCall.name;
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

Sqlite.prototype.visitOnConflict = function(onConflict) {
  throw new Error('Sqlite does not allow onConflict clause.');
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

Sqlite.prototype.visitOrIgnore = function() {
  return ['OR IGNORE'];
};

module.exports = Sqlite;
