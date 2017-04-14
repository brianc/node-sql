'use strict';

var assert     = require('assert');
var getDialect = require('../dialect');
var util       = require('util');

var Node = function(type) {
  /* jshint unused: false */
  this.nodes = [];
};

Node.prototype.toNode = function() {
  return this;
};

Node.prototype.add = function(node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
	var newNode;
  if (typeof node === 'string') newNode = new TextNode(node);
  else if (node.toNode) newNode = node.toNode();
  else newNode = node;
  this.nodes.push(newNode);
  return this;
};

Node.prototype.unshift = function(node) {
  assert(node, 'Error while trying to add a non-existant node to a query');
  this.nodes.unshift(typeof node === 'string' ? new TextNode(node) : node.toNode());
  return this;
};

// Before the change that introduced parallel dialects, every node could be turned
// into a query. The parallel dialects change made it impossible to change some nodes
// into a query because not all nodes are constructed with the sql instance.
var determineDialect = function(query, dialect) {
  var sql = query.sql || (query.table && query.table.sql);
  var Dialect;

  if (dialect) {
    // dialect is specified
    Dialect = getDialect(dialect);
  } else if (sql && sql.dialect) {
    // dialect is not specified, use the dialect from the sql instance
    Dialect = sql.dialect;
  } else {
    // dialect is not specified, use the default dialect
    Dialect = require('../').dialect;
  }
  return Dialect;
};

var initializeDialect = function(Dialect, query) {
    var config = query.sql ? query.sql.config : {};
    return new Dialect(config);
};

Node.prototype.toQuery = function(dialect) {
  var Dialect = determineDialect(this, dialect);
  return initializeDialect(Dialect, this).getQuery(this);
};

Node.prototype.toNamedQuery = function(name, dialect) {
  if (!name || typeof name !== 'string' ||  name === '') {
    throw new Error('A query name has to be a non-empty String.');
  }
  var query = this.toQuery(dialect);
  query.name = name;
  return query;
};

Node.prototype.toString = function(dialect) {
  var Dialect = determineDialect(this, dialect);
  return initializeDialect(Dialect, this).getString(this);
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
  // allow custom sub-class constructor
  if(def.constructor && def.constructor !== {}.constructor) {
    c = def.constructor;
  }
  util.inherits(c, Node);
  for (var key in def) {
    if (def.hasOwnProperty(key)) {
      c.prototype[key] = def[key];
    }
  }
  return c;
};

module.exports = Node;
var TextNode = require('./text');
