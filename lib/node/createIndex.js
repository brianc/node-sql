'use strict';

var _      = require('lodash');
var Node   = require('./');
var sliced = require('sliced');

var CreateIndexNode = module.exports = Node.define({
  type: 'CREATE INDEX',

  constructor: function(table, indexName) {
    Node.call(this);

    if (table.type === 'CREATE INDEX') {
      // implement copy constructor with duck typing
      var other    = table;
      this.table   = other.table;
      this.options = {
        algorithm : other.options.algorithm,
        // not deep cloning, because column nodes are immutable
        columns   : _.clone(other.options.columns),
        indexName : other.options.indexName,
        parser    : other.options.parser,
        type      : other.options.type
      };
    } else {
      this.table   = table;
      this.options = {
        algorithm : undefined,
        columns   : [],
        indexName : indexName,
        parser    : undefined,
        type      : undefined
      };
    }
  },

  unique: function() {
    var node = new CreateIndexNode(this);
    node.options.type = 'unique';
    return node;
  },

  spatial: function() {
    var node = new CreateIndexNode(this);
    node.options.type = 'spatial';
    return node;
  },

  fulltext: function() {
    var node = new CreateIndexNode(this);
    node.options.type = 'fulltext';
    return node;
  },

  using: function(algorithm) {
    var node = new CreateIndexNode(this);
    node.options.algorithm = algorithm;
    return node;
  },

  on: function() {
    var args = sliced(arguments);
    var node = new CreateIndexNode(this);
    node.options.columns = node.options.columns.concat(args);
    return node;
  },

  withParser: function(parser) {
    var node = new CreateIndexNode(this);
    node.options.parser = parser;
    return node;
  },

  indexName: function() {
    var result = this.options.indexName;

    if (!result) {
      var columns = this.options.columns.map(function(col) {
        return col.name;
      }).sort();

      result = [this.table._name];
      result = result.concat(columns);
      result = result.join('_');
    }

    return result;
  }
});
