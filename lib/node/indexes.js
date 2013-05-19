'use strict';

var Node = require(__dirname);
var IndexesNode = module.exports = Node.define({
  type: 'INDEXES',
  constructor: function () {
    Node.call(this);
    this.names = [];
    this.columns = [];
    this.valueSets = [];
  }
});
