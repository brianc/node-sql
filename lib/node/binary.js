'use strict';

var _        = require('lodash');
var Node     = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var BinaryNode = Node.define(_.extend({
  type: 'BINARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once.
    // There is circular dependency between unary, binary and value
    // expression mixin, thus this must be delayed to runtime.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(BinaryNode.prototype, valueExpressionMixin());
    }
  },
}));

module.exports = BinaryNode;
