'use strict';

var Node = require(__dirname);
var Column = require(__dirname + '/../column');
var BinaryNode = require(__dirname + '/binary');
var TextNode = require(__dirname + '/text');

var objectToNodes = function(table, node) {
  var result = node;
  if (!node.toNode && typeof node == 'object'){
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
    this.table = table;
  },
  type: 'WHERE',
  expr: function(other) {
    return typeof other === 'string' ? new TextNode('('+other+')') : other;
  },
  add: function(node) {
    var node = objectToNodes(this.table, node);
    return Node.prototype.add.call(this, this.expr(node));
  },
  or: function(other) {
    var right = objectToNodes(this.table, other);
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'OR',
      right: this.expr(right)
    }));
  },
  and: function(other) {
    var right = objectToNodes(this.table, other);
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'AND',
      right: this.expr(right)
    }));
  }
});
