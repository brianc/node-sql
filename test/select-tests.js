'use strict';

var assert = require('assert');
var Select = require(__dirname + '/../lib/node/select');

var select = new Select({sql: require('../lib/index')});

it('has SELECT type', function() {
  assert.equal(select.type, 'SELECT');
});


it('can go toQuery', function() {
  assert.equal(select.toQuery().text, 'SELECT ');
});
