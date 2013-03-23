'use strict';

var Node = require(__dirname);
var Column = require(__dirname + '/../column');
var BinaryNode = require(__dirname + '/binary');
var TextNode = require(__dirname + '/text');

var normalizeNode = function(table, node) {
  var result = node;
  if(typeof node == 'string') {
    result = new TextNode('(' + node + ')');
  }
  else if (!node.toNode && typeof node == 'object'){
    result = false;
    for (var colName in node) {
      var column = new Column({name: colName, table: table});
      var query = column.equals(node[colName]);
      if (!result)
        result = query;
      else
        result.and(query);
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
    var node = normalizeNode(this.table, node);
    return Node.prototype.add.call(this, node);
  },
  or: function(other) {
    var right = normalizeNode(this.table, other);
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
