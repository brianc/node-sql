/* global test */
'use strict';

var assert       = require('assert');
var PostfixUnary = require('../lib/node/postfixUnary');
var PrefixUnary  = require('../lib/node/prefixUnary');
var Table        = require('../lib/table');
var Unary        = require('../lib/node/unary');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
});

test('operators', function() {
  assert.equal(Foo.bar.isNull().operator, 'IS NULL');
  assert.equal(Foo.baz.isNotNull().operator, 'IS NOT NULL');
});

test('prefix unary', function() {
  var preUnary = new PrefixUnary({left: 'hello', operator: 'secret'});

  assert(preUnary instanceof Unary);
  assert(preUnary instanceof PrefixUnary);
  assert(!(preUnary instanceof PostfixUnary));

  assert.equal(preUnary.type, 'PREFIX UNARY');
  assert.equal(preUnary.left, 'hello');
  assert.equal(preUnary.operator, 'secret');
});

test('postfix unary', function() {
  var postUnary = new PostfixUnary({left: 'world', operator: 'noop'});

  assert(postUnary instanceof Unary);
  assert(postUnary instanceof PostfixUnary);
  assert(!(postUnary instanceof PrefixUnary));

  assert.equal(postUnary.type, 'POSTFIX UNARY');
  assert.equal(postUnary.left, 'world');
  assert.equal(postUnary.operator, 'noop');
});
