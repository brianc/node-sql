'use strict';

var Node = require('./index');

module.exports = Node.define({
  type: 'DROP',

  constructor: function(table) {
    Node.call(this);
    this.add(table);
  }
});
