'use strict';

var Node = require(__dirname);
var IndexesNode = module.exports = Node.define({
  type: 'INDEXES',

  constructor: function(table) {
    Node.call(this);

    this.table     = table;
    this.names     = [];
    this.columns   = [];
    this.valueSets = [];
  }
});
