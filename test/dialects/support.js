/* global test */
'use strict';
var assert = require('assert');

var Table = require('../../lib/table');

// specify dialect classes
var dialects = {
  pg     : require('../../lib/dialect/postgres'),
  sqlite : require('../../lib/dialect/sqlite'),
  mysql  : require('../../lib/dialect/mysql')
};

module.exports = {
  test: function(expected) {
    // for each dialect
    Object.keys(dialects).forEach(function(dialect) {
      var expectedObject = expected[dialect];
      if (undefined !== expectedObject) {

        var DialectClass = dialects[dialect];

        var title = dialect + ': ' + (expected.title || expectedObject.text || expectedObject);
        test(title, function() {

          // check if this query is expected to throw
          if (expectedObject.throws) {
            assert.throws(function() {
              new DialectClass().getQuery(expected.query);
            });
          } else {
            // build query for dialect
            var compiledQuery = new DialectClass().getQuery(expected.query);

            // test result is correct
            var expectedText = expectedObject.text || expectedObject;
            assert.equal(compiledQuery.text, expectedText, 'query result');

            // if params are specified then test these are correct
            var expectedParams = expectedObject.params || expected.params;
            if (undefined !== expectedParams) {
              assert.equal(expectedParams.length, compiledQuery.values.length, 'params length');
              for (var i = 0; i < expectedParams.length; i++) {
                assert.deepEqual(expectedParams[i], compiledQuery.values[i], 'param ' + (i + 1));
              }
            }
          }

          if (undefined !== expectedObject.string) {
            // test the toString
            if (expectedObject.throws) {
              assert.throws(function() {
                new DialectClass().getString(expected.query);
              });
            } else {
              var compiledString = new DialectClass().getString(expected.query);

              // test result is correct
              assert.equal(compiledString, expectedObject.string);
            }
          }
        });
      } // if
    }); // forEach
  },

  defineUserTable: function() {
    return Table.define({
      name: 'user',
      quote: true,
      columns: ['id', 'name']
    });
  },

  definePostTable: function() {
    return Table.define({
      name: 'post',
      columns: ['id', 'userId', 'content']
    });
  },

  defineCommentTable: function() {
    return Table.define({
      name: 'comment',
      columns: ['postId', 'text']
    });
  },

  defineCustomerTable: function() {
    return Table.define({
      name: 'customer',
      columns: ['id', 'name', 'age', 'income']
    });
  },

  // This table contains column names that correspond to popularly used variables in formulas.
  defineVariableTable: function() {
    return Table.define({
      name: 'variable',
      columns: ['a', 'b', 'c', 'd', 't', 'u', 'v', 'x', 'y', 'z']
    });
  }
};
