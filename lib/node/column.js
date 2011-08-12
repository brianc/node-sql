var Node = require(__dirname);

var Column = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.table = config.table;
  }
});

module.exports = Column;
