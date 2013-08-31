'use strict';

var Node = require('./');

module.exports = Node.define({
  type: 'SELECT',
  constructor: function(arg) {
    Node.call(this);
    if (arg && arg.sql) {
      this.sql = arg.sql;
    }
  }
});
