'use strict';

var Node = require(__dirname);
module.exports = Node.define({
  type: 'UNARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left,
    this.operator = config.operator;
  }
});
