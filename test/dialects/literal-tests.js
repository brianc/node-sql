'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.select(user.literal('foo'), user.name, user.literal('123').as('onetwothree')),
  pg: {
    text  : 'SELECT foo, "user"."name", 123 AS "onetwothree" FROM "user"',
    string: 'SELECT foo, "user"."name", 123 AS "onetwothree" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT foo, "user"."name", 123 AS "onetwothree" FROM "user"',
    string: 'SELECT foo, "user"."name", 123 AS "onetwothree" FROM "user"'
  },
  mysql: {
    text  : 'SELECT foo, `user`.`name`, 123 AS `onetwothree` FROM `user`',
    string: 'SELECT foo, `user`.`name`, 123 AS `onetwothree` FROM `user`'
  },
  oracle: {
    text  : 'SELECT foo, "user"."name", 123 "onetwothree" FROM "user"',
    string: 'SELECT foo, "user"."name", 123 "onetwothree" FROM "user"'
  },
  params: []
});


Harness.test({
  query: user.select().where(user.literal('foo = bar')),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE foo = bar',
    string: 'SELECT "user".* FROM "user" WHERE foo = bar'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE foo = bar',
    string: 'SELECT "user".* FROM "user" WHERE foo = bar'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE foo = bar',
    string: 'SELECT `user`.* FROM `user` WHERE foo = bar'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE foo = bar',
    string: 'SELECT "user".* FROM "user" WHERE foo = bar'
  },
  params: []
});

// A real world example: "How many records does page 3 have?"
// This could be less than 10 (the limit) if we are on the last page.
var subquery = user.subQuery('subquery_for_count').select(user.literal(1).as('count_column')).limit(10).offset(20);

Harness.test({
  query: user.select(subquery.count_column.count()).from(subquery),
  pg: {
    text  : 'SELECT COUNT("subquery_for_count"."count_column") AS "count_column_count" FROM (SELECT 1 AS "count_column" FROM "user" LIMIT 10 OFFSET 20) "subquery_for_count"',
    string: 'SELECT COUNT("subquery_for_count"."count_column") AS "count_column_count" FROM (SELECT 1 AS "count_column" FROM "user" LIMIT 10 OFFSET 20) "subquery_for_count"'
  },
  sqlite: {
    text  : 'SELECT COUNT("subquery_for_count"."count_column") AS "count_column_count" FROM (SELECT 1 AS "count_column" FROM "user" LIMIT 10 OFFSET 20) "subquery_for_count"',
    string: 'SELECT COUNT("subquery_for_count"."count_column") AS "count_column_count" FROM (SELECT 1 AS "count_column" FROM "user" LIMIT 10 OFFSET 20) "subquery_for_count"'
  },
  mysql: {
    text  : 'SELECT COUNT(`subquery_for_count`.`count_column`) AS `count_column_count` FROM (SELECT 1 AS `count_column` FROM `user` LIMIT 10 OFFSET 20) `subquery_for_count`',
    string: 'SELECT COUNT(`subquery_for_count`.`count_column`) AS `count_column_count` FROM (SELECT 1 AS `count_column` FROM `user` LIMIT 10 OFFSET 20) `subquery_for_count`'
  },
  oracle: {
    text  : 'SELECT COUNT("subquery_for_count"."count_column") "count_column_count" FROM (SELECT 1 "count_column" FROM "user" OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY) "subquery_for_count"',
    string: 'SELECT COUNT("subquery_for_count"."count_column") "count_column_count" FROM (SELECT 1 "count_column" FROM "user" OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY) "subquery_for_count"'
  },
  params: []
});
