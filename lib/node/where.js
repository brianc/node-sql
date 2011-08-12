var BinaryNode = require(__dirname + '/binary');
module.exports = require(__dirname).define({
  type: 'WHERE',
  or: function(other) {
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'OR',
      right: other
    }));
  },
  and: function(other) {
    return this.nodes.push(new BinaryNode({
      left: this.nodes.pop(),
      operator: 'AND',
      right: other
    }));
  }
});
