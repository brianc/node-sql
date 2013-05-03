'use strict';

var util = require('util');
var assert = require('assert');

/*jshint unused: false */
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

Node.prototype.toQuery = function() {
  var Dialect = require(__dirname + '/../').dialect;
  return new Dialect().getQuery(this);
};

Node.prototype.addAll = function(nodes) {
  for(var i = 0, len = nodes.length; i < len; i++) {
    this.add(nodes[i]);
  }
  return this;
};

Node.define = function(def) {
  var c = function() {
    Node.call(this);
  };
  //allow custom sub-class constructor
  if(def.constructor && def.constructor != {}.constructor) {
    c = def.constructor;
  }
  util.inherits(c, Node);
  for(var key in def) {
    c.prototype[key] = def[key];
  }
  return c;
};

module.exports = Node;
var TextNode = require(__dirname + '/text');
