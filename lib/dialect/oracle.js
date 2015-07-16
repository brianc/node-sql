'use strict';

var util = require('util');
var assert = require('assert');

var Oracle = function() {
  this.output = [];
  this.params = [];
};

var Postgres = require(__dirname + '/postgres');

util.inherits(Oracle, Postgres);

Oracle.prototype._myClass = Oracle;

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


module.exports = Oracle;
