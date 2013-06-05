/* global suite, test */
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

  test('sql.create creates an instance with a new dialect', function() {
      var mysql = sql.create('mysql');
      var query = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
      assert.equal(query.text, 'SELECT `user`.`id` FROM `user` WHERE (`user`.`email` = ?)');
      assert.equal(query.values[0], 'brian.m.carlson@gmail.com');

  });

  test('sql.define for parallel dialects work independently', function() {
    var mysql = sql.create('mysql');
    var postgres = sql.create('postgres');
    var sqlite = sql.create('sqlite');

    var mysqlTable = mysql.define({name: 'table', columns: ['column']});
    var postgresTable = postgres.define({name: 'table', columns: ['column']});
    var sqliteTable = sqlite.define({name: 'table', columns: ['column']});

    assert.equal(mysqlTable.sql, mysql);
    assert.equal(postgresTable.sql, postgres);
    assert.equal(sqliteTable.sql, sqlite);
  });

  test('using Sql as a class', function() {
    var Sql = sql.Sql;
    var mysql = new Sql('mysql');
    var postgres = new Sql('postgres');
    var sqlite = new Sql('sqlite');

    assert.equal(mysql.dialect, require(__dirname + '/../lib/dialect/mysql'));
    assert.equal(postgres.dialect, require(__dirname + '/../lib/dialect/postgres'));
    assert.equal(sqlite.dialect, require(__dirname + '/../lib/dialect/sqlite'));
  });

  test('creating function call works', function() {
    var functionCall = sql.functionCall('CONCAT', 'hello', 'world').toQuery();
    assert.equal(functionCall.text, 'CONCAT($1, $2)');
    assert.equal(functionCall.values[0], 'hello');
    assert.equal(functionCall.values[1], 'world');
  });

  test('creating function call on columns works', function() {
    var functionCall = sql.functionCall('CONCAT', user.id, user.email).toQuery();
    assert.equal(functionCall.text, 'CONCAT("user"."id", "user"."email")');
    assert.equal(functionCall.values.length, 0);
  });

  test('function call inside select works', function() {
    var functionCall = sql.select(sql.functionCall('CONCAT', user.id, user.email)).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(functionCall.text, 'SELECT CONCAT("user"."id", "user"."email") FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(functionCall.values[0], 'brian.m.carlson@gmail.com');
  });
});
