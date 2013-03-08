'use strict';

var util = require('util');

var Mysql = function() {
  this.output = [];
  this.params = [];
};

util.inherits(Mysql, require(__dirname + '/postgres'));

Mysql.prototype.quote = function(word) {
  return '`' + word + '`';
};

Mysql.prototype.visitParameter = function(parameter) {
  this.params.push(parameter.value());
  return "?";
};

Mysql.prototype.visitDefault = function(parameter) {
  var params = this.params;
  this.params.push('DEFAULT');
  return "?";
};

Mysql.prototype.visitOrderByColumn = function(column) {
  if(column.direction) {
    return this.visit(column.column) + ' ' + this.visit(column.direction);
  } else {
    return this.visit(column.column);
  }
};

module.exports = Mysql;
