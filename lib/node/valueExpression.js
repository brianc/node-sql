'use strict';

var OrderByValueNode = require('./orderByValue');
var ParameterNode    = require('./parameter');
var TextNode         = require('./text');

// Process values, wrapping them in ParameterNode if necessary.
var processParams = function(val) {
  return Array.isArray(val) ? val.map(ParameterNode.getNodeOrParameterNode) : ParameterNode.getNodeOrParameterNode(val);
};

// Value expressions can be composed to form new value expressions.
// ValueExpressionMixin is evaluated at runtime, hence the
// "thunk" around it.
var ValueExpressionMixin = function() {
  var BinaryNode       = require('./binary');
  var CastNode         = require('./cast');
  var PostfixUnaryNode = require('./postfixUnary');
  var TernaryNode      = require('./ternary');
  var CaseNode         = require('./case');
  var AtNode           = require('./at');
  var SliceNode        = require('./slice');

  var postfixUnaryMethod = function(operator) {
    /*jshint unused: false */
    return function(val) {
      return new PostfixUnaryNode({
        left		 : this.toNode(),
        operator : operator
      });
    };
  };

  var binaryMethod = function(operator) {
    return function(val) {
      return new BinaryNode({
        left     : this.toNode(),
        operator : operator,
        right    : processParams(val)
      });
    };
  };

  var ternaryMethod = function(operator, separator) {
    return function(middle, right) {
      return new TernaryNode({
        left      : this.toNode(),
        operator  : operator,
        middle    : processParams(middle),
        separator : separator,
        right     : processParams(right)
      });
    };
  };

  var atMethod = function(index) {
    return new AtNode(this.toNode(), processParams(index));
  };

  var sliceMethod = function(start, end) {
    return new SliceNode(this.toNode(), processParams(start), processParams(end));
  };

  var castMethod = function(dataType) {
    return new CastNode(this.toNode(), dataType);
  };

  var orderMethod = function(direction) {
    return function() {
      return new OrderByValueNode({
        value     : this.toNode(),
        direction : direction ? new TextNode(direction) : undefined
      });
    };
  };

  var caseMethod = function(whenList, thenList, elseBranch) {
    if (undefined != elseBranch) {
      elseBranch = processParams(elseBranch);
    }
    return new CaseNode({
      whenList : processParams(whenList),
      thenList : processParams(thenList),
      else     : elseBranch
    })
  }

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
    bitwiseAnd : binaryMethod('&'),
    bitwiseNot : binaryMethod('~'),
    bitwiseOr  : binaryMethod('|'),
    bitwiseXor : binaryMethod('#'),
    concat     : binaryMethod('||'),
    key        : binaryMethod('->'),
    keyText    : binaryMethod('->>'),
    path       : binaryMethod('#>'),
    pathText   : binaryMethod('#>>'),
    like       : binaryMethod('LIKE'),
    notLike    : binaryMethod('NOT LIKE'),
    in         : binaryMethod('IN'),
    notIn      : binaryMethod('NOT IN'),
    between    : ternaryMethod('BETWEEN', 'AND'),
    at         : atMethod,
    slice      : sliceMethod,
    cast       : castMethod,
    descending : orderMethod('DESC'),
    case       : caseMethod
  };
};

module.exports = ValueExpressionMixin;
