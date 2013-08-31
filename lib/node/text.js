'use strict';

var Node = require('./');

module.exports = Node.define({
  type: 'TEXT',
  constructor: function(text) {
    Node.call(this);
    this.text = text;
  }
});
