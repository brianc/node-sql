'use strict';
var assert = require('assert');

var Table = require(__dirname + '/../../lib/table');

// specify dialect classes
var dialects = {
  pg : require('../../lib/dialect/postgres'),
  sqlite: require('../../lib/dialect/sqlite'),
  mysql : require('../../lib/dialect/mysql')
};

module.exports = {
  test:  function(expected) {

    // for each dialect
    Object.keys(dialects).forEach(function(dialect) {
      if(expected[dialect]) {

        var DialectClass = dialects[dialect];

        var title = dialect+': '+(expected.title || expected[dialect].text || expected[dialect]);
        test(title, function() {

          // check if this query is expected to throw
          if(expected[dialect].throws) {

            assert.throws(function() {
              new DialectClass().getQuery(expected.query);
            });

          } else {

            // build query for dialect
            var compiledQuery = new DialectClass().getQuery(expected.query);

            // test result is correct
            var expectedText = expected[dialect].text || expected[dialect];
            assert.equal(compiledQuery.text, expectedText,'query result');

            // if params are specified then test these are correct
            var expectedParams = expected[dialect].params || expected.params;
            if(expectedParams) {
              assert.equal(expectedParams.length, compiledQuery.values.length, 'params length');
              for(var i = 0; i < expectedParams.length; i++) {
                assert.equal(expectedParams[i], compiledQuery.values[i], 'param '+(i+1));
              }
            }

          }
        });


      } // if
    }); // forEach

  },

  defineUserTable: function () {
    return Table.define({
      name: 'user',
      quote: true,
      columns: ['id','name']
    });
  },

  definePostTable: function () {
    return Table.define({
      name: 'post',
      columns: ['id', 'userId', 'content']
    });
  },

  defineCommentTable: function () {
    return Table.define({
      name: 'comment',
      columns: ['postId', 'text']
    });
  }
};
