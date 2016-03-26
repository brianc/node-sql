'use strict';

var _                    = require('lodash');
var ColumnNode           = require('./node/column');
var OrderByValueNode     = require('./node/orderByValue');
var TextNode             = require('./node/text');
var valueExpressionMixin = require('./node/valueExpression');

var Column = function(config) {
  this.table = config.table;
  for (var name in config) {
    if (config.hasOwnProperty(name)) {
      this[name] = config[name];
    }
  }
  this.asc = this.ascending = this;
  this.alias = null;
  this.desc = this.descending = new OrderByValueNode({
    value     : this.toNode(),
    direction : new TextNode('DESC')
  });
  this.dataType = config.dataType;
  this.defaultValue = config.defaultValue;
};

// mix in value expression
_.extend(Column.prototype, valueExpressionMixin());

var contextify = function(base) {
  var context = Object.create(Column.prototype);
  Object.keys(base).forEach(function (key) {
    context[key] = base[key];
  });
  return context;
};

Column.prototype.value = function(value) {
  var context = contextify(this);
  context._value = value;
  return context;
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

module.exports = Column;
