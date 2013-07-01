'use strict';

var Node = require('./');
var IndexesNode = module.exports = Node.define({
  type: 'INDEXES',

  constructor: function(table) {
    Node.call(this);

    this.table = table;
  }
});
