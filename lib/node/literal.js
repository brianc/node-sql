'use strict';

var Node = require('./index');

module.exports = Node.define({
  type: 'LITERAL',
  constructor: function(literal) {
    Node.call(this);
    this.literal = literal;
    this.alias = null;
  },
  as: function(alias) {
    this.alias = alias;
    return this;
  }
});
