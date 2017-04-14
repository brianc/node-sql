'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var InNode = Node.define(_.extend({
  type: 'IN',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.right = config.right;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(InNode.prototype, valueExpressionMixin());
    }
  },
}));

// allow aliasing
var AliasNode = require('./alias');
_.extend(InNode.prototype, AliasNode.AliasMixin);

module.exports = InNode;
