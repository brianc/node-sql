'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'CREATE INDEX',

  constructor: function(table, indexName) {
    Node.call(this);

    this.table     = table;
    this.names     = [];
    this.columns   = [];
    this.valueSets = [];
    this.options   = { indexName: indexName, columns: [] };
  },

  unique: function() {
    this.options.type = 'unique';
    return this;
  },

  spatial: function() {
    this.options.type = 'spatial';
    return this;
  },

  fulltext: function() {
    this.options.type = 'fulltext';
    return this;
  },

  using: function(algorithm) {
    this.options.algorithm = algorithm;
    return this;
  },

  on: function() {
    var args = Array.prototype.slice.call(arguments);
    this.options.columns = this.options.columns.concat(args);
    return this;
  },

  withParser: function(parser) {
    this.options.parser = parser;
    return this;
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
