'use strict';

var Node = require(__dirname);
var BinaryNode = require(__dirname + '/binary');
var TextNode = require(__dirname + '/text');

var normalizeNode = function(table, node) {
  var result = node;
  if(typeof node === 'string') {
    result = new TextNode('(' + node + ')');
  }
  else if (Array.isArray(node)) {
    result = false;

    if (node.length === 0) {
      result = new TextNode('(1 = 1)');
    } else {
      node.forEach(function (subNode) {
        if (!result) {
          result = subNode;
        } else {
          result = result.and(subNode);
        }
      });
    }
  }
  else if (!node.toNode && typeof node === 'object'){
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

module.exports = Node.define({
  constructor: function(table) {
    Node.call(this);
    this.table = table;
  },
  type: 'WHERE',
  add: function(node) {
    node = normalizeNode(this.table, node);
    return Node.prototype.add.call(this, node);
  },
  or: function(other) {
    var right = normalizeNode(this.table, other);
    // calling 'or' without an initial 'where'
    if(!this.nodes.length) {
      return this.add(other);
    }
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'OR',
      right: right
    }));
  },
  and: function(other) {
    var right = normalizeNode(this.table, other);
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'AND',
      right: right
    }));
  }
});
