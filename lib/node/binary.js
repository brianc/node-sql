'use strict';
var Node = require(__dirname);
var BinaryNode = module.exports = Node.define({
  type: 'BINARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;
  },
  or: function(node) {
    return new BinaryNode({
      left: this,
      operator: 'OR',
      right: node
    });
  },
  and: function(node) {
    return new BinaryNode({
      left: this,
      operator: 'AND',
      right: node
    });
  }
});
