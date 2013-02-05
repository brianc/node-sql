var Node = require(__dirname);

module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.alias = config.alias;
    this.asArray = config.asArray;
    this.table = config.table;
    this.value = config.getValue();
    this.dataType = config.dataType;
  }
});
