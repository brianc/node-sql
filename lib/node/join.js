var JoinNode = module.exports = require(__dirname).define({
  type: 'JOIN',
  constructor: function(subType, from, to) {
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
  }
});
