'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'FOREIGN KEY',
  constructor: function(config) {
    Node.call(this);
    this.name = config.name;
    this.columns = config.columns;
    this.schema = config.schema;
    this.table = config.table;
    this.refColumns = config.refColumns;
    this.onUpdate = config.onUpdate;
    this.onDelete = config.onDelete;
    this.constraint = config.constraint;
  }
});

