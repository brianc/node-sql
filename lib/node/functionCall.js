'use strict';

var Node = require(__dirname);
var ParameterNode = require(__dirname + '/parameter');

module.exports = Node.define({
  type: 'FUNCTION CALL',
  constructor: function(name, args) {
    Node.call(this);
    this.name = name;
    this.addAll(args.map(function (v) {
        return v.toNode ? v.toNode() : new ParameterNode(v);
    }));
  },
});
