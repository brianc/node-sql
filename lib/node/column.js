'use strict';

var Node = require('./');

var ColumnNode = module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    Node.call(this);

    // implement copy constructor functionality
    this.name       = config.name;
    this.alias      = config.alias;
    this.star       = config.star;
    this.asArray    = config.asArray;
    this.aggregator = config.aggregator;
    this.table      = config.table;
    this.value      = config.getValue ? config.getValue() : config.value;
    this.dataType   = config.dataType;
    this.distinct   = config.distinct;
    this.primaryKey = config.primaryKey;
  },
  as: function(alias) {
    // create a new node with the alias
    var node = new ColumnNode(this);
    node.alias = alias;
    return node;
  }
});
