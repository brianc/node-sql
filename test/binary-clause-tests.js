'use strict';
var assert = require('assert');
var Table = require(__dirname + '/../lib/table');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
});

test('operators', function() {
  assert.equal(Foo.baz.equals(1).operator, '=');
  assert.equal(Foo.baz.equal(1).operator, '=');
  assert.equal(Foo.baz.notEqual(1).operator, '<>');
  assert.equal(Foo.baz.notEquals(1).operator, '<>');
  assert.equal(Foo.baz.like('asdf').operator, 'LIKE');
  assert.equal(Foo.baz.isNull().operator, 'IS NULL');
  assert.equal(Foo.baz.isNotNull().operator, 'IS NOT NULL');
  assert.equal(Foo.baz.gt(1).operator, '>');
  assert.equal(Foo.baz.gte(1).operator, '>=');
  assert.equal(Foo.baz.lt(1).operator, '<');
  assert.equal(Foo.baz.lte(1).operator, '<=');
});
