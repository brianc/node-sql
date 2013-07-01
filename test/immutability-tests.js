/* global test */
'use strict';
var assert = require('assert');

var ColumnNode = require('../lib/node/column');

test('ColumNode immutable', function() {
  var original = new ColumnNode({});
  var aliased = original.as('something else');

  assert.notEqual(original, aliased);
  assert.equal(aliased.alias, 'something else');
});
