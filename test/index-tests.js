'use strict';
var assert = require('assert');

var sql = require('../lib');

var user = sql.define({
  name: 'user',
  columns: ['id', 'email']
});

describe('index', function() {
  it('unknown dialect throws exception', function() {
    assert.throws(function() {
      sql.setDialect('asdf');
    });
  });

  it('stores the default dialect\'s name if none has been passed', function() {
    assert.equal(sql.create().dialectName, 'postgres');
  });

  it('stores the sqlite dialect', function() {
    assert.equal(sql.create('sqlite').dialectName, 'sqlite');
  });

  it('stores the mysql dialect', function() {
    assert.equal(sql.create('mysql').dialectName, 'mysql');
  });

  it('stores the mssql dialect', function() {
    assert.equal(sql.create('mssql').dialectName, 'mssql');
  });
  
  it('stores the oracle dialect', function() {
    assert.equal(sql.create('oracle').dialectName, 'oracle');
  });


  it('can create a query using the default dialect', function() {
    var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
  });

  it('setting dialect to postgres works', function() {
    sql.setDialect('postgres');
    var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
  });

  it('sql.create creates an instance with a new dialect', function() {
    var mysql = sql.create('mysql');
    var query = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
    assert.equal(query.text, 'SELECT `user`.`id` FROM `user` WHERE (`user`.`email` = ?)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
  });

  it('sql.define for parallel dialects work independently', function() {
    var mssql = sql.create('mssql');
    var mysql = sql.create('mysql');
    var postgres = sql.create('postgres');
    var sqlite = sql.create('sqlite');
    var oracle = sql.create('oracle');

    var mssqlTable = mssql.define({name: 'table', columns: ['column']});
    var mysqlTable = mysql.define({name: 'table', columns: ['column']});
    var postgresTable = postgres.define({name: 'table', columns: ['column']});
    var sqliteTable = sqlite.define({name: 'table', columns: ['column']});
    var oracleTable = oracle.define({name: 'table', columns: ['column']});

    assert.equal(mysqlTable.sql, mysql);
    assert.equal(postgresTable.sql, postgres);
    assert.equal(sqliteTable.sql, sqlite);
    assert.equal(mssqlTable.sql, mssql);
    assert.equal(oracleTable.sql, oracle);
  });

  it('using Sql as a class', function() {
    var Sql = sql.Sql;
    var mssql = new Sql('mssql');
    var mysql = new Sql('mysql');
    var postgres = new Sql('postgres');
    var sqlite = new Sql('sqlite');
    var oracle = new Sql('oracle');

    assert.equal(mysql.dialect, require(__dirname + '/../lib/dialect/mysql'));
    assert.equal(postgres.dialect, require(__dirname + '/../lib/dialect/postgres'));
    assert.equal(sqlite.dialect, require(__dirname + '/../lib/dialect/sqlite'));
    assert.equal(mssql.dialect, require(__dirname + '/../lib/dialect/mssql'));
    assert.equal(oracle.dialect, require(__dirname + '/../lib/dialect/oracle'));
  });

  it('override dialect for toQuery using dialect name', function() {
    var Sql = sql.Sql;
    var mssql = new Sql('mssql');
    var mysql = new Sql('mysql');
    var postgres = new Sql('postgres');
    var sqlite = new Sql('sqlite');
    var oracle = new Sql('oracle');

    var sqliteQuery = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('sqlite');
    var postgresQuery = sqlite.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('postgres');
    var mysqlQuery = postgres.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('mysql');
    var mssqlQuery = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('mssql');
    var oracleQuery = oracle.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery('oracle');

    var values = ['brian.m.carlson@gmail.com'];
    assert.equal(sqliteQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(sqliteQuery.values, values);

    assert.equal(postgresQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(postgresQuery.values, values);

    assert.equal(mysqlQuery.text, 'SELECT `user`.`id` FROM `user` WHERE (`user`.`email` = ?)');
    assert.deepEqual(mysqlQuery.values, values);

    assert.equal(mssqlQuery.text, 'SELECT [user].[id] FROM [user] WHERE ([user].[email] = @1)');
    assert.deepEqual(mssqlQuery.values, values);
    
    assert.equal(oracleQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = :1)');
    assert.deepEqual(oracleQuery.values, values);
  });

  it('override dialect for toQuery using invalid dialect name', function() {
    var query = sql.select(user.id).from(user);
    assert.throws(function() {
      query.toQuery('invalid');
    });
  });

  it('using named queries with toNamedQuery', function() {
    var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('users');
    assert.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.equal(query.values[0], 'brian.m.carlson@gmail.com');
    assert.equal(query.name, 'users');
  });

  it('provide an empty query name for toNamedQuery', function() {
    var query = sql.select(user.id).from(user);
    assert.throws(function() {
      query.toNamedQuery('');
    });
  });

  it('provide an undefined query name for toNamedQuery', function() {
    var query = sql.select(user.id).from(user);
    assert.throws(function() {
      query.toNamedQuery();
    });
  });

  it('override dialect for toNamedQuery using dialect name', function() {
    var Sql = sql.Sql;
    var mysql = new Sql('mysql');
    var postgres = new Sql('postgres');
    var sqlite = new Sql('sqlite');
    var mssql = new Sql('mssql');
    var oracle = new Sql('oracle');

    var sqliteQuery = mysql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('user.select_brian','sqlite');
    var postgresQuery = sqlite.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('user.select_brian','postgres');
    var mysqlQuery = postgres.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('user.select_brian','mysql');
    var oracleQuery = mssql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('user.select_brian','oracle');
    var mssqlQuery = oracle.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toNamedQuery('user.select_brian','mssql');


    var values = ['brian.m.carlson@gmail.com'];
    assert.equal(sqliteQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(sqliteQuery.values, values);
    assert.equal('user.select_brian', sqliteQuery.name);

    assert.equal(postgresQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
    assert.deepEqual(postgresQuery.values, values);
    assert.equal('user.select_brian', postgresQuery.name);

    assert.equal(mysqlQuery.text, 'SELECT `user`.`id` FROM `user` WHERE (`user`.`email` = ?)');
    assert.deepEqual(mysqlQuery.values, values);
    assert.equal('user.select_brian', mysqlQuery.name);
    
    assert.equal(mssqlQuery.text, 'SELECT [user].[id] FROM [user] WHERE ([user].[email] = @1)');
    assert.deepEqual(mssqlQuery.values, values);
    assert.equal('user.select_brian', mssqlQuery.name);
    
    assert.equal(oracleQuery.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = :1)');
    assert.deepEqual(oracleQuery.values, values);
    assert.equal('user.select_brian', oracleQuery.name);

  });

  it('override dialect for toNamedQuery using invalid dialect name', function() {
    var query = sql.select(user.id).from(user);
    assert.throws(function() {
      query.toNamedQuery('name', 'invalid');
    });
  });

  it('mssql default parameter place holder is @index', function() {
    var Sql = sql.Sql;
    var mssql = new Sql('mssql');
    var query = mssql.select(user.id).from(user).where(user.email.equals('x@y.com')).toQuery();
    assert.equal(query.text, 'SELECT [user].[id] FROM [user] WHERE ([user].[email] = @1)');
    assert.equal(query.values[0], 'x@y.com');
  });

  it('mssql override default parameter placeholder with ?', function() {
    var Sql = sql.Sql;
    var mssql = new Sql('mssql',{questionMarkParameterPlaceholder:true});
    var query = mssql.select(user.id).from(user).where(user.email.equals('x@y.com')).toQuery();
    assert.equal(query.text, 'SELECT [user].[id] FROM [user] WHERE ([user].[email] = ?)');
    assert.equal(query.values[0], 'x@y.com');
  });

});
