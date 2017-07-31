'use strict';

var util = require('util');
var assert = require('assert');
var _ = require('lodash');

var Mysql = function(config) {
  this.output = [];
  this.params = [];
  this.config = config || {};
};

var Postgres = require('./postgres');

util.inherits(Mysql, Postgres);

Mysql.prototype._myClass = Mysql;

Mysql.prototype._quoteCharacter = '`';

Mysql.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Mysql.prototype.visitReplace = function(replace) {
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

  if (result[2] === 'DEFAULT VALUES') {
    result[2] = '() VALUES ()';
  }
  return result;
};

Mysql.prototype._getParameterPlaceholder = function() {
  return '?';
};

Mysql.prototype._getParameterValue = function(value) {
  if (Buffer.isBuffer(value)) {
    value = 'x' + this._getParameterValue(value.toString('hex'));
  } else {
    value = Postgres.prototype._getParameterValue.call(this, value);
  }
  return value;
};

Mysql.prototype.visitOnDuplicate = function(onDuplicate) {
  var params = [];
  /* jshint boss: true */
  for(var i = 0, node; node = onDuplicate.nodes[i]; i++) {
    var target_col = this.visit(node);
    params = params.concat(target_col + ' = ' + this.visit(node.value));
  }
  var result = [
    'ON DUPLICATE KEY UPDATE',
    params.join(', ')
  ];
  return result;
};

Mysql.prototype.visitOnConflict = function(onConflict) {
  throw new Error('Mysql does not allow onConflict clause.');
};

Mysql.prototype.visitReturning = function() {
  throw new Error('MySQL does not allow returning clause.');
};

Mysql.prototype.visitForShare = function() {
  throw new Error('MySQL does not allow FOR SHARE clause.');
};

Mysql.prototype.visitCreate = function(create) {
  var result = Mysql.super_.prototype.visitCreate.call(this, create);
  var engine = this._queryNode.table._initialConfig.engine;
  var charset = this._queryNode.table._initialConfig.charset;

  if ( !! engine) {
    result.push('ENGINE=' + engine);
  }

  if ( !! charset) {
    result.push('DEFAULT CHARSET=' + charset);
  }

  return result;
};

Mysql.prototype.visitRenameColumn = function(renameColumn) {
  var dataType = renameColumn.nodes[1].dataType || renameColumn.nodes[0].dataType;
  assert(dataType, 'dataType missing for column ' + (renameColumn.nodes[1].name || renameColumn.nodes[0].name || '') +
    ' (CHANGE COLUMN statements require a dataType)');
  return ['CHANGE COLUMN ' + this.visit(renameColumn.nodes[0]) + ' ' + this.visit(renameColumn.nodes[1]) + ' ' + dataType];
};

Mysql.prototype.visitInsert = function(insert) {
  var result = Postgres.prototype.visitInsert.call(this, insert);
  if (result[2] === 'DEFAULT VALUES') {
    result[2] = '() VALUES ()';
  }
  return result;
};

Mysql.prototype.visitIndexes = function(node) {
  var tableName = this.visit(this._queryNode.table.toNode())[0];

  return "SHOW INDEX FROM " + tableName;
};

Mysql.prototype.visitBinary = function(binary) {
  if (binary.operator === '@@') {
    var self = this;
    var text = '(MATCH ' + this.visit(binary.left) + ' AGAINST ';
    text += this.visit(binary.right);
    text += ')';
    return [text];
  }
  return Mysql.super_.prototype.visitBinary.call(this, binary);
};

Mysql.prototype.visitFunctionCall = function(functionCall) {
  var _this=this;

  this._visitingFunctionCall = true;

  function _extract() {
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 1) throw new Error('Not enough parameters passed to ' + functionCall.name + ' function');
    var txt = functionCall.name + '(' + (nodes[0]+'') + ')';
    return txt;
  }

  var txt="";
  var name = functionCall.name;
  // Override date functions since mysql is different than postgres
  if (['YEAR', 'MONTH', 'DAY', 'HOUR'].indexOf(functionCall.name) >= 0) txt = _extract();
  // Override CURRENT_TIMESTAMP function to remove parens
  else if ('CURRENT_TIMESTAMP' == functionCall.name) txt = functionCall.name;
  else txt = name + '(' + functionCall.nodes.map(this.visit.bind(this)).join(', ') + ')';

    this._visitingFunctionCall = false;
  return [txt];
};

Mysql.prototype.visitColumn = function(columnNode) {
  var self = this;
  var inSelectClause;

  function isCountStarExpression(columnNode){
    if (!columnNode.aggregator) return false;
    if (columnNode.aggregator.toLowerCase()!='count') return false;
    if (!columnNode.star) return false;
    return true;
  }

  function _countStar(){
    // Implement our own since count(table.*) is invalid in Mysql
    var result='COUNT(*)';
    if(inSelectClause && columnNode.alias) {
      result += ' AS ' + self.quote(columnNode.alias);
    }
    return result;
  }

  inSelectClause = !this._selectOrDeleteEndIndex;
  if(isCountStarExpression(columnNode)) return _countStar();
  return Mysql.super_.prototype.visitColumn.call(this, columnNode);
};

Mysql.prototype.visitInterval = function(interval) {
  var parameter;
  if(_.isNumber(interval.years)) {
    if(_.isNumber(interval.months)) {
      parameter = "'" + interval.years + '-' + interval.months + "' YEAR_MONTH";
    } else {
      parameter = interval.years + ' YEAR';
    }
  } else if(_.isNumber(interval.months)) {
    parameter = interval.months + ' MONTH';
  } else if(_.isNumber(interval.days)) {
    parameter = "'" + interval.days + ' ' + 
      (_.isNumber(interval.hours)?interval.hours:0) + ':' +
      (_.isNumber(interval.minutes)?interval.minutes:0) + ':' +
      (_.isNumber(interval.seconds)?interval.seconds:0) + "' DAY_SECOND";
  } else {
    parameter = "'" + (_.isNumber(interval.hours)?interval.hours:0) + ':' +
      (_.isNumber(interval.minutes)?interval.minutes:0) + ':' +
      (_.isNumber(interval.seconds)?interval.seconds:0) + "' HOUR_SECOND";
  }
  var result = "INTERVAL " + parameter;
  return result;
};



module.exports = Mysql;
