'use strict';

var _        = require('lodash');
var Node     = require(__dirname);
var ParameterNode = require(__dirname + '/parameter');

var binaryMethod = function(operator) {
  return function(val) {
    var node = new BinaryNode({
      left: this.toNode(),
      operator: operator
    });
    if (Array.isArray(val)) {
      node.right = val.map(function (v) {
        return v.toNode ? v.toNode() : new ParameterNode(v);
      });
    }
    else {
      node.right = val.toNode ? val.toNode() : new ParameterNode(val);
    }
    return node;
  };
};

// Value expressions can be composed to form new binary expressions.
// ValueExpressionMixin is in this file because it depends upon
// BinaryNode, while BinaryNode depends upon ValueExpressionMixin.
var ValueExpressionMixin = {
  or       : binaryMethod('OR'),
  and      : binaryMethod('AND'),
  equals   : binaryMethod('='),
  equal    : binaryMethod('='),
  notEquals: binaryMethod('<>'),
  notEqual : binaryMethod('<>'),
  gt       : binaryMethod('>'),
  gte      : binaryMethod('>='),
  lt       : binaryMethod('<'),
  lte      : binaryMethod('<='),
  add      : binaryMethod('+'),
  subtract : binaryMethod('-'),
  multiply : binaryMethod('*'),
  divide   : binaryMethod('/'),
  modulo   : binaryMethod('%'),
  like     : binaryMethod('LIKE'),
  notLike  : binaryMethod('NOT LIKE'),
  in       : binaryMethod('IN'),
  notIn    : binaryMethod('NOT IN')
};

var BinaryNode = Node.define(_.extend({
  type: 'BINARY',
  constructor: function(config) {
    Node.call(this);
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;
  },
}, ValueExpressionMixin));

module.exports = {
  BinaryNode : BinaryNode,
  ValueExpressionMixin: ValueExpressionMixin
};
