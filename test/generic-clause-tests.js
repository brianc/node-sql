'use strict';

var assert = require('assert');
var _ = require('lodash');
var Table = require(__dirname + '/../lib/table');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
});

// Examples:
// "Foo.select(Foo.baz.op('IS NOT NULL')())" is equivalent to:
// "Foo.select(Foo.baz.isNotNull())"
// 'SELECT ("foo"."baz" IS NOT NULL) FROM "foo"'
//
// "Foo.select(Foo.baz.op('>')(1))" is equivalent to:
// "Foo.select(Foo.baz.gt(1))"
// 'SELECT ("foo"."baz" > 1) FROM "foo"'
//
// "Foo.select(Foo.baz.op('BETWEEN', 'AND')(1, 2))" is equivalent to:
// "Foo.select(Foo.baz.between(1, 2))"
// 'SELECT ("foo"."baz" BETWEEN 1 AND 2) FROM "foo"'

var existingUnaryOperators = {
  isNull: ['IS NULL'],
  isNotNull: ['IS NOT NULL']
};

function checkUnaryMatch(checkQuery, operator) {
  // asserts that the operator is constructed as expected
  // asserts that use of .op()() forms the correct query
  var comparison = Foo.baz.op(operator)();
  var query = Foo.select(comparison).toQuery();
  assert.equal(comparison.operator, operator);
  assert.equal(query.text, checkQuery);
}

test('custom unary operators', function() {
  _.each(existingUnaryOperators, function(values, name) {
    // checks that existing operators can be replicated using .op()()
    checkUnaryMatch(Foo.select(Foo.baz[name]()).toQuery().text, values[0]);
  });
  checkUnaryMatch('SELECT ("foo"."baz" BAR) FROM "foo"', 'BAR');
});


var existingBinaryOperators = {
  equals: ['=', 1],
  equal: ['=', 1],
  notEquals: ['<>', 1],
  notEqual: ['<>', 1],
  like: ['LIKE', 'asdf'],
  notLike: ['NOT LIKE', 'asdf'],
  gt: ['>', 1],
  gte: ['>=', 1],
  lt: ['<', 1],
  lte: ['<=', 1],
  plus: ['+', 1],
  minus: ['-', 1],
  multiply: ['*', 1],
  leftShift: ['<<', 1],
  rightShift: ['>>', 1],
  bitwiseAnd: ['&', 1],
  bitwiseNot: ['~', 1],
  bitwiseOr: ['|', 1],
  bitwiseXor: ['#', 1],
  divide: ['/', 1],
  modulo: ['%', 1],
  regex: ['~', 1],
  iregex: ['~*', 1],
  notRegex: ['!~', 1],
  notIregex: ['!~*', 1],
  regexp: ['REGEXP', 1],
  rlike: ['RLIKE', 1],
  ilike: ['ILIKE', 'asdf'],
  notIlike: ['NOT ILIKE', 'asdf'],
  match: ['@@', 'asdf']
};

function checkBinaryMatch(checkQuery, operator, right) {
  // asserts that the operator is constructed as expected
  // asserts that use of .op()() forms the correct query
  var comparison = Foo.baz.op(operator)(right);
  var query = Foo.select(comparison).toQuery();
  assert.equal(comparison.operator, operator);
  assert.equal(query.text, checkQuery);
  assert.equal(query.values[0], right);
}

test('custom binary operators', function() {
  _.each(existingBinaryOperators, function(values, name) {
      // checks that existing operators can be replicated using .op()()
    checkBinaryMatch(Foo.select(Foo.baz[name](values[1])).toQuery().text, values[0], values[1]);
  });
  checkBinaryMatch('SELECT ("foo"."baz" BAR $1) FROM "foo"', 'BAR', 1);
  checkBinaryMatch('SELECT ("foo"."baz" <-> $1) FROM "foo"', '<->', 'asdf');
});


var existingTernaryOperators = {
  between: ['BETWEEN', 'AND', 1, 2]
};

function checkTernaryMatch(checkQuery, operator, separator, middle, right) {
  // asserts that the operator and separator are constructed as expected
  // asserts that use of .op()() forms the correct query
  var comparison = Foo.baz.op(operator, separator)(middle, right);
  var query = Foo.select(comparison).toQuery();
  assert.equal(comparison.operator, operator);
  assert.equal(comparison.separator, separator);
  assert.equal(query.text, checkQuery);
  assert.equal(query.values[0], middle);
  assert.equal(query.values[1], right);
}

test('custom ternary operators', function() {
  _.each(existingTernaryOperators, function(values, name) {
    // checks that existing operators can be replicated using .op()()
    checkTernaryMatch(Foo.select(Foo.baz[name](values[2], values[3])).toQuery().text, values[0], values[1], values[2], values[3]);
  });
  checkTernaryMatch('SELECT ("foo"."baz" BAR $1 BAT $2) FROM "foo"', 'BAR', 'BAT', 1, 2);
});
