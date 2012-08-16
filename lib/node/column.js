var Node = require(__dirname);

module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.table = config.table;
    this.value = config.getValue();
  }
});
