'use strict';

var _          = require('lodash');
var BinaryNode = require('./binary');
var Node       = require('./');
var TextNode   = require('./text');

var normalizeNode = function(table, node) {
  var result = node;
  if (typeof node === 'string') {
    result = new TextNode('(' + node + ')');
  } else if (!node.toNode && typeof node === 'object'){
    result = false;
    for (var colName in node) {
      if (node.hasOwnProperty(colName)) {
        var column = table.getColumn(colName);
        var query = column.equals(node[colName]);
        if (!result) {
          result = query;
        } else {
          result = result.and(query);
        }
      }
    }
  }
  return result;
};

var Where = Node.define({
  type: 'WHERE',
  constructor: function(table) {
    Node.call(this);

    if (table.type === 'WHERE') {
      // copy constructor
      var other = table;
      this.nodes = _.clone(other.nodes);
      this.table = other.table;
    } else {
      this.table = table;
    }
  },
  add: function(node) {
    node = normalizeNode(this.table, node);
    var mutated = new Where(this);
    return Node.prototype.add.call(mutated, node);
  },
  or: function(other) {
    var right = normalizeNode(this.table, other);
    var mutated = new Where(this);
    // calling 'or' without an initial 'where'
    if (!mutated.nodes.length) {
      return mutated.add(other);
    }
    mutated.nodes.push(new BinaryNode({
      left: mutated.nodes.pop(),
      operator: 'OR',
      right: right
    }));
    return mutated;
  },
  and: function(other) {
    var right = normalizeNode(this.table, other);
    var mutated = new Where(this);
    mutated.nodes.push(new BinaryNode({
      left: mutated.nodes.pop(),
      operator: 'AND',
      right: right
    }));
    return mutated;
  }
});

module.exports = Where;
