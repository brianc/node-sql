'use strict';

var Node = require(__dirname);

module.exports = Node.define({
  type: 'CREATE VIEW',

  constructor: function(viewName) {
    Node.call(this);

    this.options = { viewName: viewName};
  }
});
