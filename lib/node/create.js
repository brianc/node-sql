'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'CREATE',

  constructor: function(isTemporary) {
    Node.call(this);

    this.options = { isTemporary: isTemporary};
  },

});
