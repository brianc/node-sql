'use strict';

var Node = require(__dirname);

module.exports = Node.define({
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
