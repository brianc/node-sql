'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var valueExpressionMixin = require('./valueExpression');

var valueExpressionMixed = false;
var CaseNode = Node.define(_.extend({
  type: 'CASE',
  constructor: function(config) {
    Node.call(this);
    this.whenList = config.whenList;
    this.thenList = config.thenList;
    this.else     = config.else;

    // Delay mixin to runtime, when all nodes have been defined, and
    // mixin only once. ValueExpressionMixin has circular dependencies.
    if (!valueExpressionMixed) {
      valueExpressionMixed = true;
      _.extend(CaseNode.prototype, valueExpressionMixin());
    }
  },
}));

// allow aliasing
var AliasNode = require('./alias');
_.extend(CaseNode.prototype, AliasNode.AliasMixin);

module.exports = CaseNode;
