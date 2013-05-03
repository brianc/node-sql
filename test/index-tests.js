'use strict';
var assert = require('assert');

var sql = require(__dirname + '/../lib');

var user = sql.define({
  name: 'user',
  columns: ['id', 'email']
});

suite('index', function() {
  test('unknown dialect throws exception', function() {
    assert.throws(function() {
      sql.setDialect('asdf');
    });
  });


  test('throws before dialect is set', function() {
    assert.throws(function() {
      var query = sql.select(user.id).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    });
  });

  test('setting dialect to postgres works', function() {
    sql.setDialect('postgres');
    var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
  });
});
