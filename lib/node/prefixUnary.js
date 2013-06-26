'use strict';

var UnaryNode = require('./unary');
var util      = require('util');

var PrefixUnaryNode = function() {
  PrefixUnaryNode.super_.apply(this, arguments);
};

// inherit from unary node
util.inherits(PrefixUnaryNode, UnaryNode);

// set the type only after inheriting from unary node
PrefixUnaryNode.prototype.type = 'PREFIX UNARY';

module.exports = PrefixUnaryNode;
