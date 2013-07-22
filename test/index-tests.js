/* global suite, test */
'use strict';
var assert = require('assert');

var sql = require('../lib');

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

  test('stores the default dialect\'s name if none has been passed', function() {
    assert.equal(sql.create().dialectName, 'postgres');
  });

  test('stores the sqlite dialect', function() {
    assert.equal(sql.create('sqlite').dialectName, 'sqlite');
  });

  test('stores the mysql dialect', function() {
    assert.equal(sql.create('mysql').dialectName, 'mysql');
  });

  test('can create a query using the default dialect', function() {
    var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
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

  test('override dialect for toQuery using dialect name', function() {
    var Sql = sql.Sql;
    var mysql = new Sql('mysql');
    var postgres = new Sql('postgres');
    var sqlite = new Sql('sqlite');

    var sqliteQuery = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('sqlite');
    var postgresQuery = sqlite.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('postgres');
    var mysqlQuery = postgres.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('mysql');

    var values = ['brian.m.carlson@gmail.com'];
    assert.equal(sqliteQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(sqliteQuery.values, values);

    assert.equal(postgresQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(postgresQuery.values, values);

    assert.equal(mysqlQuery.text, 'SELECT `user`.`id` FROM `user` WHERE (`user`.`email` = ?)');
    assert.deepEqual(mysqlQuery.values, values);
  });

  test('override dialect for toQuery using invalid dialect name', function() {
    var query = sql.select(user.id).from(user);
    assert.throws(function() {
      query.toQuery('invalid');
    });
  });
});
