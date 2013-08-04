'use strict';

var Node = require(__dirname);

var OrderByColumn = Node.define({
  type: 'ORDER BY VALUE',
  constructor: function(config) {
    Node.call(this);
    this.value = config.value;
    this.direction = config.direction;
  }
});

 module.exports = OrderByColumn;
