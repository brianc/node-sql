'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var BinaryNode = Node.define(_.extend({
  type: 'BINARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(BinaryNode.prototype, valueExpressionMixin());
    }
  },
}));

// allow aliasing
var AliasNode = require('./alias');
_.extend(BinaryNode.prototype, AliasNode.AliasMixin);

module.exports = BinaryNode;
