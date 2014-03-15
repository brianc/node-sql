'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var NotInNode = Node.define(_.extend({
  type: 'NOT IN',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.right = config.right;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(NotInNode.prototype, valueExpressionMixin());
    }
  },
}));

// allow aliasing
var AliasNode = require(__dirname + '/alias');
_.extend(NotInNode.prototype, AliasNode.AliasMixin);

module.exports = NotInNode;
