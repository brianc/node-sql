'use strict';

var Node = require(__dirname);
var JoinNode = module.exports = Node.define({
  type: 'JOIN',
  constructor: function(subType, from, to) {
    Node.call(this);

    if (subType.type === 'JOIN') {
      // implement copy constructor
      var other = subType;
      this.subType = other.subType;
      this.from = other.from;
      this.to = other.to;
      this.on = other.on;
    } else {
      this.subType = subType;
      this.from = from.toNode();
      this.to = to.toNode();
    }
  },

  on: function(node) {
    var mutated = new JoinNode(this);
    mutated.on = node;
    return mutated;
  },

  join: function(other) {
    return new JoinNode('INNER', this, other);
  },

  leftJoin: function(other) {
    return new JoinNode('LEFT', this, other);
  }
});
