'use strict';

var BinaryNode = require(__dirname + '/binary');
var TextNode = require(__dirname + '/text');
module.exports = require(__dirname).define({
  type: 'WHERE',
  expr: function(other) {
    return typeof other === 'string' ? new TextNode('('+other+')') : other;
  },
  or: function(other) {
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'OR',
      right: this.expr(other)
    }));
  },
  and: function(other) {
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'AND',
      right: this.expr(other)
    }));
  }
});
