'use strict';

var util = require('util');
var assert = require('assert');

var Mysql = function() {
  this.output = [];
  this.params = [];
};

util.inherits(Mysql, require(__dirname + '/postgres'));

Mysql.prototype._quoteCharacter = '`';

Mysql.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Mysql.prototype.visitParameter = function(parameter) {
  this.params.push(parameter.value());
  return "?";
};

Mysql.prototype.visitDefault = function(parameter) {
  return "DEFAULT";
};

Mysql.prototype.visitOrderByColumn = function(column) {
  if(column.direction) {
    return this.visit(column.column) + ' ' + this.visit(column.direction);
  } else {
    return this.visit(column.column);
  }
};

Mysql.prototype.visitRenameColumn = function(renameColumn) {
  var dataType = renameColumn.nodes[1].dataType || renameColumn.nodes[0].dataType;
  assert(dataType, 'dataType missing for column ' + (renameColumn.nodes[1].name || renameColumn.nodes[0].name || '') +
    ' (CHANGE COLUMN statements require a dataType)');
  return ['CHANGE COLUMN ' + this.visit(renameColumn.nodes[0]) + ' ' + this.visit(renameColumn.nodes[1])+' '+dataType];
};


module.exports = Mysql;
