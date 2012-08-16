var Node = require(__dirname);

module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.table = config.table;
    this.quote = config.quote;
    this.value = config.getValue();
  }
});
