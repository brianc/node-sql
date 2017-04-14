'use strict';

var Node = require('./index');
module.exports = Node.define({
  type: 'TABLE',
  constructor: function(table) {
    Node.call(this);
    this.table = table;
  }
});
