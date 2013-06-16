'use strict';

var _ = require('lodash');

var Node = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var ColumnNode = module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    Node.call(this);
    this.name = config.name;
    this.alias = config.alias;
    this.star = config.star;
    this.asArray = config.asArray;
    this.aggregator = config.aggregator;
    this.table = config.table;
    this.value = config.getValue();
    this.dataType = config.dataType;
    this.distinct = config.distinct;
    this.extraText = config.extraText || '';
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once.  This is to avoid circular dependency in
    // CommonJS.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(ColumnNode.prototype, valueExpressionMixin());
    }
  },
  as: function(alias) {
    this.alias = alias;
    return this;
  },
  appendText: function(text) {
    this.extraText += text;
    return this;
  },
  //TODO change order of parameters @ v1.0
  aggregate: function(alias, aggregator) {
    this.aggregator = aggregator.toUpperCase();
    this.alias = alias || this.alias || this.name + '_' + aggregator.toLowerCase();
    return this;
  },
  count: function(alias) {
    return this.aggregate(alias, 'count');
  }
});
