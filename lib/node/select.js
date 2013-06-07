'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'SELECT',
  constructor: function(arg) {
    Node.call(this);
    if (arg && arg.sql) { 
        this.sql = arg.sql;
    }
  } 
});
