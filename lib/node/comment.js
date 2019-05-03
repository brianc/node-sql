'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'COMMENT',
  constructor: function(table, comment) {
    Node.call(this);

    this.comment = comment;
  },
});
