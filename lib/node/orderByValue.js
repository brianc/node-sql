'use strict';

var Node = require('./index');

var OrderByColumn = Node.define({
  type: 'ORDER BY VALUE',
  constructor: function(config) {
    Node.call(this);
    this.value = config.value;
    this.direction = config.direction;
    // used when processing OFFSET and LIMIT clauses in MSSQL
    this.msSQLOffsetNode=undefined;
    this.msSQLLimitNode=undefined;
  }
});

 module.exports = OrderByColumn;
