'use strict';

var Node = require(__dirname);

var ParameterNode = module.exports = Node.define({
  type: 'PARAMETER',
  constructor: function(val) {
    Node.call(this);
    this._val = val;
  },
  value: function() {
    return this._val;
  }
});

// wrap a value as a parameter node if value is not already a node
module.exports.getNodeOrParameterNode = function(value) {
  if (value && value.toNode) {
    // use toNode
    return value.toNode();
  } else {
    // wrap as parameter node
    return new ParameterNode(value);
  }
};
