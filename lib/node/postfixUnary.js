'use strict';

var UnaryNode = require('./unary');
var util      = require('util');

var PostfixUnaryNode = function() {
  PostfixUnaryNode.super_.apply(this, arguments);
};

// inherit from unary node
util.inherits(PostfixUnaryNode, UnaryNode);

// set the type only after inheriting from unary node
PostfixUnaryNode.prototype.type = 'POSTFIX UNARY';

module.exports = PostfixUnaryNode;
