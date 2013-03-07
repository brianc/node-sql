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

module.exports = Mysql;
