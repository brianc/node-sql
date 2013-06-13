'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
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
var AliasNode = require(__dirname + '/alias');
_.extend(UnaryNode.prototype, AliasNode.AliasMixin);

module.exports = UnaryNode;
