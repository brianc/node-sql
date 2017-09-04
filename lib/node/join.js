'use strict';

var Node = require('./index');
var JoinNode = module.exports = Node.define({
  type: 'JOIN',
  constructor: function(subType, from, to) {
    Node.call(this);
    this.sql = (from.table && from.table.sql) || (to.table && to.table.sql);
    this.subType = subType;
    this.from = from.toNode();
    this.to = to.toNode();
  },
  on: function(node) {
    this.on = node;
    return this;
  },
  join: function(other) {
    return new JoinNode('INNER', this, other);
  },
  leftJoin: function(other) {
    return new JoinNode('LEFT', this, other);
  }
});
