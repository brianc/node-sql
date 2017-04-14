'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var SliceNode = Node.define({
  type: 'SLICE',
  constructor: function(value, start, end) {
    Node.call(this);
    this.value = value;
    this.start = start;
    this.end = end;
    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(SliceNode.prototype, valueExpressionMixin());
    }
  }
});

// allow aliasing
var AliasNode = require('./alias');
_.extend(SliceNode.prototype, AliasNode.AliasMixin);

module.exports = SliceNode;
