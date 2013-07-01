'use strict';

var Node = require('./');

module.exports = Node.define({
  type: 'DROP INDEX',

  constructor: function(table, indexName) {
    if (!indexName) {
      throw new Error('No index defined!');
    } else if (Array.isArray(indexName) && (typeof indexName[0] === 'string')) {
      indexName = indexName[0];
    } else if (Array.isArray(indexName)) {
      var columns = indexName.map(function(col) { return col.name; }).sort();
      indexName = [table._name].concat(columns).join('_');
    }

    Node.call(this);

    this.table   = table;
    this.options = { indexName: indexName };
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
