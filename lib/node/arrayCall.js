'use strict';

var _                    = require('lodash');
var Node                 = require(__dirname);
var ParameterNode        = require(__dirname + '/parameter');
var valueExpressionMixin = require(__dirname + '/valueExpression');

var ArrayCallNode = Node.define({
  type: 'ARRAY CALL',
  constructor: function(args) {
    Node.call(this);
    args = _.flatten(args);
    this.addAll(args.map(ParameterNode.getNodeOrParameterNode));
  }
});

// mix in value expression
_.extend(ArrayCallNode.prototype, valueExpressionMixin());

// allow aliasing
var AliasNode = require(__dirname + '/alias');
_.extend(ArrayCallNode.prototype, AliasNode.AliasMixin);

module.exports = ArrayCallNode;
