'use strict';

var _             = require('lodash');
var Node          = require(__dirname);
var ParameterNode = require(__dirname + '/parameter');

// Process values, wrapping them in ParameterNode if necessary.
var processParams = function(val) {
  return Array.isArray(val) ? val.map(ParameterNode.getNodeOrParameterNode) : ParameterNode.getNodeOrParameterNode(val);
};

// Value expressions can be composed to form new value expressions.
// ValueExpressionMixin is evaluated at runtime, hence the
// "thunk" around it.
var ValueExpressionMixin = module.exports = function() {
  var PostfixUnaryNode   = require(__dirname + '/postfixUnary');
  var BinaryNode  = require(__dirname + '/binary');
  var TernaryNode = require(__dirname + '/ternary');

  var postfixUnaryMethod = function(operator) {
    /*jshint unused: false */
    return function(val) {
      return new PostfixUnaryNode({
        left: this.toNode(),
        operator: operator
      });
    };
  };

  var binaryMethod = function(operator) {
    return function(val) {
      return new BinaryNode({
        left: this.toNode(),
        operator: operator,
        right: processParams(val)
      });
    };
  };

  var ternaryMethod = function(operator, separator) {
    return function(middle, right) {
      return new TernaryNode({
        left: this.toNode(),
        operator: operator,
        middle: processParams(middle),
        separator: separator,
        right: processParams(right)
      });
    };
  };

  return {
    isNull     : postfixUnaryMethod('IS NULL'),
    isNotNull  : postfixUnaryMethod('IS NOT NULL'),
    or         : binaryMethod('OR'),
    and        : binaryMethod('AND'),
    equals     : binaryMethod('='),
    equal      : binaryMethod('='),
    notEquals  : binaryMethod('<>'),
    notEqual   : binaryMethod('<>'),
    gt         : binaryMethod('>'),
    gte        : binaryMethod('>='),
    lt         : binaryMethod('<'),
    lte        : binaryMethod('<='),
    plus       : binaryMethod('+'),
    minus      : binaryMethod('-'),
    multiply   : binaryMethod('*'),
    divide     : binaryMethod('/'),
    modulo     : binaryMethod('%'),
    leftShift  : binaryMethod('<<'),
    rightShift : binaryMethod('>>'),
    like       : binaryMethod('LIKE'),
    notLike    : binaryMethod('NOT LIKE'),
    in         : binaryMethod('IN'),
    notIn      : binaryMethod('NOT IN'),
    between    : ternaryMethod('BETWEEN', 'AND')
  };
};
