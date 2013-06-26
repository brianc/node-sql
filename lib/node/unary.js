'use strict';

var _                    = require('lodash');
var Node                 = require('./');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;

// parent class of prefix and postfix unary
var UnaryNode = Node.define({
  type: 'UNARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(UnaryNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require('./alias');
_.extend(UnaryNode.prototype, AliasNode.AliasMixin);

module.exports = UnaryNode;
