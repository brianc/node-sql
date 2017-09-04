'use strict';

var _                    = require('lodash');
var Node                 = require('./index');
var ParameterNode        = require('./parameter');
var valueExpressionMixin = require('./valueExpression');

var FunctionCallNode = Node.define({
  type: 'FUNCTION CALL',
  constructor: function(name, args) {
    Node.call(this);
    this.name = name;
    this.addAll(args.map(ParameterNode.getNodeOrParameterNode));
  }
});

// mix in value expression
_.extend(FunctionCallNode.prototype, valueExpressionMixin());

// allow aliasing
var AliasNode = require('./alias');
_.extend(FunctionCallNode.prototype, AliasNode.AliasMixin);

module.exports = FunctionCallNode;
