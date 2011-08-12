var Node = require(__dirname);

module.exports = Node.define({
  type: 'TEXT',
  constructor: function(text) {
    this.text = text;
  }
});
