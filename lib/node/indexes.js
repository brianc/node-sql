'use strict';

var Node = require('./');

var IndexesNode  = Node.define({
  type: 'INDEXES',

  constructor: function(table) {
    Node.call(this);

    this.table = table;
  }
});

module.exports = IndexesNode;
