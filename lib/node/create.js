'use strict';

var Node = require('./index');

module.exports = Node.define({
  type: 'CREATE',

  constructor: function(isTemporary) {
    Node.call(this);

    this.options = { isTemporary: isTemporary};
  },

});
