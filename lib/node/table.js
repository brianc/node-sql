'use strict';

var Node = require(__dirname);
module.exports = Node.define({
  type: 'TABLE',
  constructor: function(table) {
    Node.call(this);
    this.table = table;
  }
});
