'use strict';

var Node = require(__dirname);
var ValueExpressionMixin = require(__dirname + '/valueExpression');

var valueExpressionMixed = false;
module.exports = Node.define({
  type: 'UNARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once.  This is to avoid circular dependency in
    // CommonJS.
    if (!valueExpressionMixed) {
      _.extend(UnaryNode.prototype, ValueExpressionMixin());
    }
  }
});
