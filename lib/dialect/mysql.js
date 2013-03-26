'use strict';

var util = require('util');
var assert = require('assert');

var Mysql = function() {
  this.output = [];
  this.params = [];
};

var Postgres = require(__dirname + '/postgres');

util.inherits(Mysql, Postgres);

Mysql.prototype._myClass = Mysql;

Mysql.prototype._quoteCharacter = '`';

Mysql.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Mysql.prototype.visitParameter = function(parameter) {
  this.params.push(parameter.value());
  return "?";
};

/*jshint unused: false */
Mysql.prototype.visitDefault = function(parameter) {
  return "DEFAULT";
};

Mysql.prototype.visitRenameColumn = function(renameColumn) {
  var dataType = renameColumn.nodes[1].dataType || renameColumn.nodes[0].dataType;
  assert(dataType, 'dataType missing for column ' + (renameColumn.nodes[1].name || renameColumn.nodes[0].name || '') +
    ' (CHANGE COLUMN statements require a dataType)');
  return ['CHANGE COLUMN ' + this.visit(renameColumn.nodes[0]) + ' ' + this.visit(renameColumn.nodes[1])+' '+dataType];
};

Mysql.prototype.visitInsert = function(insert) {
  var result = Postgres.prototype.visitInsert.call(this, insert);
  if (result[2] === 'DEFAULT VALUES') result[2] = '() VALUES ()';
  return result;
};

module.exports = Mysql;
