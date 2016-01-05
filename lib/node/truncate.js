'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'TRUNCATE',

  constructor: function(table) {
    Node.call(this);
    this.add(table);
  }
});
