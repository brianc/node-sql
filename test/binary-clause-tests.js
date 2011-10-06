var test = require('tap').test;
var Column = require(__dirname + '/../lib/column');
var Table = require(__dirname + '/../lib/table');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
})

test('operators', function(t) {
  t.equal(Foo.baz.equals(1).operator, '=');
  t.equal(Foo.baz.equal(1).operator, '=');
  t.equal(Foo.baz.notEqual(1).operator, '<>');
  t.equal(Foo.baz.notEquals(1).operator, '<>');
  t.equal(Foo.baz.like('asdf').operator, 'LIKE');
  t.equal(Foo.baz.isNull().operator, 'IS NULL');
  t.equal(Foo.baz.isNotNull().operator, 'IS NOT NULL');
  t.equal(Foo.baz.gt(1).operator, '>');
  t.equal(Foo.baz.gte(1).operator, '>=');
  t.equal(Foo.baz.lt(1).operator, '<');
  t.equal(Foo.baz.lte(1).operator, '<=');
  t.end();
})
