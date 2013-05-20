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
