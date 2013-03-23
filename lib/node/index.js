'use strict';

var assert = require('assert');

var Node = function(type) {
  this.nodes = [];
};

Node.prototype.toNode = function() {
  return this;
};

Node.prototype.add = function(node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  this.nodes.push(typeof node === 'string' ? new TextNode(node) : node.toNode());
  return this;
};

Node.prototype.addAll = function(nodes) {
  for(var i = 0, len = nodes.length; i < len; i++) {
    this.add(nodes[i]);
  }
  return this;
}

Node.define = function(def) {
  var c = function() {
    Node.apply(this, arguments);
    if(def.constructor) {
      def.constructor.apply(this, arguments);
    }
  };
  var key;
  for(key in Node.prototype) {
    c.prototype[key] = Node.prototype[key];
  }
  for(key in def) {
    c.prototype[key] = def[key];
  }
  return c;
};

module.exports = Node;
var TextNode = require(__dirname + '/text');
