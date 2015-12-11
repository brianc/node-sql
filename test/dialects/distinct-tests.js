'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.select(user.id.distinct()),
  pg: {
    text  : 'SELECT DISTINCT("user"."id") FROM "user"',
    string: 'SELECT DISTINCT("user"."id") FROM "user"'
  },
  sqlite: {
    text  : 'SELECT DISTINCT("user"."id") FROM "user"',
    string: 'SELECT DISTINCT("user"."id") FROM "user"'
  },
  mysql: {
    text  : 'SELECT DISTINCT(`user`.`id`) FROM `user`',
    string: 'SELECT DISTINCT(`user`.`id`) FROM `user`'
  },
  mssql: {
    text  : 'SELECT DISTINCT([user].[id]) FROM [user]',
    string: 'SELECT DISTINCT([user].[id]) FROM [user]'
  },
  oracle: {
    text  : 'SELECT DISTINCT("user"."id") FROM "user"',
    string: 'SELECT DISTINCT("user"."id") FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id.count().distinct().as('count')),
  pg: {
    text  : 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"',
    string: 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"',
    string: 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"'
  },
  mysql: {
    text  : 'SELECT COUNT(DISTINCT(`user`.`id`)) AS `count` FROM `user`',
    string: 'SELECT COUNT(DISTINCT(`user`.`id`)) AS `count` FROM `user`'
  },
  mssql: {
    text  : 'SELECT COUNT(DISTINCT([user].[id])) AS [count] FROM [user]',
    string: 'SELECT COUNT(DISTINCT([user].[id])) AS [count] FROM [user]'
  },
  oracle: {
    text  : 'SELECT COUNT(DISTINCT("user"."id")) "count" FROM "user"',
    string: 'SELECT COUNT(DISTINCT("user"."id")) "count" FROM "user"'
  },
  params: []
});

// BELOW HERE TEST DISTINCT ON THE ENTIRE RESULTS SET, NOT JUST ONE COLUMN

Harness.test({
  query: user.select().distinct(),
  pg: {
    text  : 'SELECT DISTINCT "user".* FROM "user"',
    string: 'SELECT DISTINCT "user".* FROM "user"'
  },
  sqlite: {
    text  : 'SELECT DISTINCT "user".* FROM "user"',
    string: 'SELECT DISTINCT "user".* FROM "user"'
  },
  mysql: {
    text  : 'SELECT DISTINCT `user`.* FROM `user`',
    string: 'SELECT DISTINCT `user`.* FROM `user`'
  },
  mssql: {
    text  : 'SELECT DISTINCT [user].* FROM [user]',
    string: 'SELECT DISTINCT [user].* FROM [user]'
  },
  oracle: {
    text  : 'SELECT DISTINCT "user".* FROM "user"',
    string: 'SELECT DISTINCT "user".* FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id).distinct(),
  pg: {
    text  : 'SELECT DISTINCT "user"."id" FROM "user"',
    string: 'SELECT DISTINCT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT DISTINCT "user"."id" FROM "user"',
    string: 'SELECT DISTINCT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'SELECT DISTINCT `user`.`id` FROM `user`',
    string: 'SELECT DISTINCT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'SELECT DISTINCT [user].[id] FROM [user]',
    string: 'SELECT DISTINCT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'SELECT DISTINCT "user"."id" FROM "user"',
    string: 'SELECT DISTINCT "user"."id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id,user.name).distinct(),
  pg: {
    text  : 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text  : 'SELECT DISTINCT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT DISTINCT `user`.`id`, `user`.`name` FROM `user`'
  },
  mssql: {
    text  : 'SELECT DISTINCT [user].[id], [user].[name] FROM [user]',
    string: 'SELECT DISTINCT [user].[id], [user].[name] FROM [user]'
  },
  oracle: {
    text  : 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT DISTINCT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

