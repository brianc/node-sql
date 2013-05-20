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
    this.options   = { indexName: indexName };
  },

  unique: function() {
    this.options.type = 'unique';
    return this;
  },

  using: function(algorithm) {
    this.options.algorithm = algorithm;
    return this;
  },

  on: function() {
    this.options.columns = Array.prototype.slice.call(arguments);
    return this;
  },

  withParser: function(parser) {
    this.options.parser = parser;
    return this;
  },

  indexName: function() {
    var result = this.options.indexName;

    if (!result) {
      result = [this.table._name];
      this.options.columns.forEach(function(col) {
        result.push(col.name);
      });
      result = result.join('_');
    }

    return result;
  }
});