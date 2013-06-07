/* global test */
'use strict';

var assert = require('assert');
var Table = require(__dirname + '/../lib/table');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
});

test('operators', function() {
  assert.equal(Foo.bar.between(1, 2).operator, 'BETWEEN');
  assert.equal(Foo.baz.between(1, 2).separator, 'AND');
});
