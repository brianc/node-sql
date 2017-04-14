'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var CastNode = Node.define({
  type: 'CAST',
  constructor: function(value, dataType) {
    Node.call(this);
    this.value = value;
    this.dataType = dataType;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(CastNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require('./alias');
_.extend(CastNode.prototype, AliasNode.AliasMixin);

module.exports = CastNode;
