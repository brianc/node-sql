'use strict';

var Node = require('./index');

module.exports = Node.define({
  type: 'TRUNCATE',

  constructor: function(table) {
    Node.call(this);
    this.add(table);
  }
});
