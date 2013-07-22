'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var ParameterNode        = require(__dirname + '/parameter');
var valueExpressionMixin = require(__dirname + '/valueExpression');

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
var AliasNode = require(__dirname + '/alias');
_.extend(FunctionCallNode.prototype, AliasNode.AliasMixin);

module.exports = FunctionCallNode;
