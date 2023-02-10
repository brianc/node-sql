'use strict';

var assert = require('assert');
var Table = require(__dirname + '/../lib/table');

var Foo = Table.define({
  name: 'foo',
  columns: ['baz','bar']
});

it('operators', function() {
  assert.equal(Foo.bar.isNull().operator, 'IS NULL');
  assert.equal(Foo.baz.isNotNull().operator, 'IS NOT NULL');
});
