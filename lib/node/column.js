var Node = require(__dirname);

module.exports = Node.define({
  type: 'COLUMN',
  constructor: function(config) {
    this.name = config.name;
    this.alias = config.alias;
    this.star = config.star;
    this.asArray = config.asArray;
    this.aggCount = config.aggCount;
    this.table = config.table;
    this.value = config.getValue();
    this.dataType = config.dataType;
  },
  as: function(alias) {
    this.alias = alias;
    return this;
  }
});
