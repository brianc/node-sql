'use strict';

var _ = require('lodash');
var ColumnNode = require(__dirname + '/node/column');
var ParameterNode = require(__dirname + '/node/parameter');
var ValueExpressionMixin = require(__dirname + '/node/binary').ValueExpressionMixin;
var OrderByColumnNode = require(__dirname + '/node/orderByColumn');
var UnaryNode = require(__dirname + '/node/unary');
var TextNode = require(__dirname + '/node/text');

var Column = function(config) {
  this.table = config.table;
  for(var name in config) {
    this[name] = config[name];
  }
  this.asc = this.ascending = this;
  this.alias = null;
  this.desc = this.descending = new OrderByColumnNode({
    column: this.toNode(),
    direction: new TextNode('DESC')
  });
  this.dataType = config.dataType;
};

var unaryMethod = function(name, operator) {
  /*jshint unused: false */
  Column.prototype[name] = function(val) {
    return new UnaryNode({
      left: this.toNode(),
      operator: operator
    });
  };
};

var contextify = function(base) {
  var context = Object.create(Column.prototype);
  Object.keys(base).forEach(function (key) {
    context[key] = base[key];
  });
  return context;
};

Column.prototype.value = function(value) {
  this._value = value;
  return this;
};

Column.prototype.getValue = function() {
  return this._value;
};

Column.prototype.toNode = function() {
  // creates a query node from this column
  return new ColumnNode(contextify(this));
};

Column.prototype.as = function(alias) {
  var context = contextify(this);
  context.alias = alias;
  return new ColumnNode(context);
};

Column.prototype.arrayAgg = function(alias) {
  var context = contextify(this);
  context.asArray = true;
  context.alias = alias || context.name + 's';
  return new ColumnNode(context);
};

Column.prototype.aggregate = function(alias, aggregator) {
  var context = contextify(this);
  context.aggregator = aggregator.toUpperCase();
  context.alias = alias || context.name + '_' + context.aggregator.toLowerCase();
  return new ColumnNode(context);
};

Column.prototype.count = function(alias) {
  return this.aggregate(alias, 'count');
};

Column.prototype.min = function(alias) {
  return this.aggregate(alias, 'min');
};

Column.prototype.max = function(alias) {
  return this.aggregate(alias, 'max');
};

Column.prototype.sum = function(alias) {
  return this.aggregate(alias, 'sum');
};

Column.prototype.avg = function(alias) {
  return this.aggregate(alias, 'avg');
};

Column.prototype.distinct = function() {
  var context = contextify(this);
  context.distinct = true;
  return new ColumnNode(context);
};

Column.prototype.toQuery = function() {
  return this.toNode().toQuery();
};

Column.prototype = _.extend(Column.prototype, ValueExpressionMixin);

unaryMethod('isNull', 'IS NULL');
unaryMethod('isNotNull', 'IS NOT NULL');

module.exports = Column;
