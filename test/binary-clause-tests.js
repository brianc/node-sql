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
  assert.equal(Foo.baz.notLike('asdf').operator, 'NOT LIKE');
  assert.equal(Foo.baz.isNull().operator, 'IS NULL');
  assert.equal(Foo.baz.isNotNull().operator, 'IS NOT NULL');
  assert.equal(Foo.baz.gt(1).operator, '>');
  assert.equal(Foo.baz.gte(1).operator, '>=');
  assert.equal(Foo.baz.lt(1).operator, '<');
  assert.equal(Foo.baz.lte(1).operator, '<=');
  assert.equal(Foo.baz.plus(1).operator, '+');
  assert.equal(Foo.baz.minus(1).operator, '-');
  assert.equal(Foo.baz.multiply(1).operator, '*');
  assert.equal(Foo.baz.leftShift(1).operator, '<<');
  assert.equal(Foo.baz.rightShift(1).operator, '>>');
  assert.equal(Foo.baz.bitwiseAnd(1).operator, '&');
  assert.equal(Foo.baz.bitwiseNot(1).operator, '~');
  assert.equal(Foo.baz.bitwiseOr(1).operator, '|');
  assert.equal(Foo.baz.bitwiseXor(1).operator, '#');
  assert.equal(Foo.baz.divide(1).operator, '/');
  assert.equal(Foo.baz.modulo(1).operator, '%');
  assert.equal(Foo.baz.regex(1).operator, '~');
  assert.equal(Foo.baz.iregex(1).operator, '~*');
  assert.equal(Foo.baz.notRegex(1).operator, '!~');
  assert.equal(Foo.baz.notIregex(1).operator, '!~*');
  assert.equal(Foo.baz.regexp(1).operator, 'REGEXP');
  assert.equal(Foo.baz.rlike(1).operator, 'RLIKE');
  assert.equal(Foo.baz.ilike('asdf').operator, 'ILIKE');
  assert.equal(Foo.baz.notIlike('asdf').operator, 'NOT ILIKE');
  assert.equal(Foo.baz.match('asdf').operator, '@@');
});
