'use strict';

var _        = require('lodash');
var Node     = require(__dirname);
var ValueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var BinaryNode = Node.define(_.extend({
  type: 'BINARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once.  This is to avoid circular dependency in
    // CommonJS.
    if (!valueExpressionMixed) {
      _.extend(BinaryNode.prototype, ValueExpressionMixin());
    }
  },
}));

module.exports = BinaryNode;
