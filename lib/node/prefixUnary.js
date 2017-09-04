'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var PrefixUnaryNode = Node.define({
  type: 'PREFIX UNARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(PrefixUnaryNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require('./alias');
_.extend(PrefixUnaryNode.prototype, AliasNode.AliasMixin);

module.exports = PrefixUnaryNode;
