'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'TEXT',
  constructor: function(text) {
    Node.call(this);
    this.text = text;
  }
});
