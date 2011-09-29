var Node = require(__dirname);

var Column = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.table = config.table;
    this.quote = config.quote;
    this.value = config.getValue();
  }
});

module.exports = Column;
