'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var valueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
var CastNode = Node.define({
  type: 'CAST',
  constructor: function(value, data_type) {
    Node.call(this);
    this.value = value;
    this.data_type  = data_type;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(CastNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require(__dirname + '/alias');
_.extend(CastNode.prototype, AliasNode.AliasMixin);

module.exports = CastNode;
