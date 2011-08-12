module.exports = require(__dirname).define({
  type: 'JOIN',
  constructor: function(subType, from, to) {
    this.subType = subType;
    this.from = from;
    this.to = to;
  },
  on: function(node) {
    this.on = node;
    return this;
  }
});
