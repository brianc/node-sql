'use strict';

var Node = require(__dirname);
module.exports = Node.define({
  type: 'PARAMETER',
  constructor: function(val) {
    Node.call(this);
    this._val = val;
  },
  value: function() {
    return this._val;
  }
});
