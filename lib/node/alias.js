'use strict';

var _ = require('lodash');
var Node = require('./index');

var AliasNode = Node.define({
  type: 'ALIAS',
  constructor: function(value, alias) {
    Node.call(this);

    this.value = value;
    this.alias = alias;
  }
});

var AliasMixin = {
  as: function(alias) {
    // create an alias node
    var aliasNode = new AliasNode(this, alias);

    // defaults the properties of the aliased node
    _.defaults(aliasNode, this);

    return aliasNode;
  }
};

module.exports = AliasNode;
module.exports.AliasMixin = AliasMixin;
