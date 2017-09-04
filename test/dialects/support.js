'use strict';
var assert = require('assert');

var Table = require('../../lib/table');

// specify dialect classes
var dialects = {
  pg     : require('../../lib/dialect/postgres'),
  sqlite : require('../../lib/dialect/sqlite'),
  mysql  : require('../../lib/dialect/mysql'),
  mssql  : require('../../lib/dialect/mssql'),
  oracle  : require('../../lib/dialect/oracle')
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
              new DialectClass(expectedObject.config).getQuery(expected.query);
            });
          } else {
            // build query for dialect
            var compiledQuery = new DialectClass(expectedObject.config).getQuery(expected.query);

            // test result is correct
            var expectedText = expectedObject.text || expectedObject;
            assert.equal(compiledQuery.text, expectedText);

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
                new DialectClass(expectedObject.config).getString(expected.query);
              });
            } else {
              var compiledString = new DialectClass(expectedObject.config).getString(expected.query);

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
      columns: ['id', 'userId', 'content', 'tags', 'length']
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
      columns: ['id', 'name', 'age', 'income', 'metadata']
    });
  },

  // This table defines the customer attributes as a composite field
  defineCustomerCompositeTable: function() {
    return Table.define({
      name: 'customer',
      columns: {
        id: {},
        info: {subfields: ['name', 'age', 'salary']}
      }
    });
  },

  defineCustomerAliasTable: function() {
    return Table.define({
      name: 'customer',
      columns: {
        id: {property: 'id_alias'},
        name: {property: 'name_alias'},
        age: {property: 'age_alias'},
        income: {property: 'income_alias'},
        metadata: {property: 'metadata_alias'}
      }
    });
  },

  // This table contains column names that correspond to popularly used variables in formulas.
  defineVariableTable: function() {
    return Table.define({
      name: 'variable',
      columns: ['a', 'b', 'c', 'd', 't', 'u', 'v', 'x', 'y', 'z']
    });
  },

// this table is for testing snakeName related stuff
  defineContentTable: function() {
    return Table.define({
      name: 'content',
      columns: ['content_id', 'text', 'content_posts'],
      snakeToCamel: true
    });
  }
};
