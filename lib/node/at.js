'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var AtNode = Node.define({
  type: 'AT',
  constructor: function(value, index) {
    Node.call(this);
    this.value = value;
    this.index = index;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(AtNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require('./alias');
_.extend(AtNode.prototype, AliasNode.AliasMixin);

module.exports = AtNode;
