var BinaryNode = module.exports = require(__dirname).define({
  type: 'BINARY',
  constructor: function(config) {
    this.left = config.left;
    this.operator = config.operator;
    this.right = config.right;
  },
  or: function(node) {
    return new BinaryNode({
      left: this,
      operator: 'OR',
      right: node
    });
  },
  and: function(node) {
    return new BinaryNode({
      left: this,
      operator: 'AND',
      right: node
    });
  }
})
