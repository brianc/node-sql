/* global test */
'use strict';

var assert = require('assert');
var Harness = require('./dialects/support');

var table = Harness.defineCustomerTable();
var query = table.select();
var subQuery = table.subQuery();

var subquerySpecificFunctions = [
  'star',
  'exists',
  'notExists'
];

subquerySpecificFunctions.forEach(function(name) {
  test('function ' + name + ' exists', function() {
    assert.equal(typeof query[name], 'function');
  });

  test('cannot use ' + name + ' without subQuery', function() {
    assert.throws(function() {
      query[name]();
    });
  });

  test('can use ' + name + ' with subQuery', function() {
    assert(subQuery[name]());
  });
});
