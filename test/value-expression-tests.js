/* global suite, test */
'use strict';

var assert = require('assert');
var valueExpressionMixin = require(__dirname + './../lib/node/valueExpression');
var Node = require(__dirname + './../lib/node');

suite('value-expression', function() {
  test("value expression mixin should not overwrite Node prototype properties", function() {
    var mixin = valueExpressionMixin();

    // make sure that the node class doesn't have any conflicting properties
    for (var key in mixin) {
      assert.equal(Node.prototype[key], undefined);
    }
  });
});
