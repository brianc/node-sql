'use strict';

var Node = require(__dirname);
var OrderByColumn = Node.define({
  type: 'ORDER BY COLUMN',
  constructor: function(config) {
    Node.call(this);
    this.column = config.column;
    this.direction = config.direction;
  }
});

 module.exports = OrderByColumn;
