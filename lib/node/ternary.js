'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var TernaryNode = Node.define(_.extend({
  type: 'TERNARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.middle = config.middle;
    this.operator = config.operator;
    this.right = config.right;
    this.separator = config.separator;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(TernaryNode.prototype, valueExpressionMixin());
    }
  },
}));

// allow aliasing
var AliasNode = require(__dirname + '/alias');
_.extend(TernaryNode.prototype, AliasNode.AliasMixin);

module.exports = TernaryNode;
