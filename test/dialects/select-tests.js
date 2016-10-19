'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();
var customerAlias = Harness.defineCustomerAliasTable();
var Sql = require('../../lib');

Harness.test({
  query: post.select(post.id).select(post.content),
  pg: {
    text  : 'SELECT "post"."id", "post"."content" FROM "post"',
    string: 'SELECT "post"."id", "post"."content" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT "post"."id", "post"."content" FROM "post"',
    string: 'SELECT "post"."id", "post"."content" FROM "post"'
  },
  mysql: {
    text  : 'SELECT `post`.`id`, `post`.`content` FROM `post`',
    string: 'SELECT `post`.`id`, `post`.`content` FROM `post`'
  },
  mssql: {
    text  : 'SELECT [post].[id], [post].[content] FROM [post]',
    string: 'SELECT [post].[id], [post].[content] FROM [post]'
  },
  oracle: {
    text  : 'SELECT "post"."id", "post"."content" FROM "post"',
    string: 'SELECT "post"."id", "post"."content" FROM "post"'
  },
  params: []
});

Harness.test({
  query: customerAlias.select(customerAlias.star()),
  pg: {
    text  : 'SELECT "customer"."id" AS "id_alias", "customer"."name" AS "name_alias", "customer"."age" AS "age_alias", "customer"."income" AS "income_alias", "customer"."metadata" AS "metadata_alias" FROM "customer"',
    string: 'SELECT "customer"."id" AS "id_alias", "customer"."name" AS "name_alias", "customer"."age" AS "age_alias", "customer"."income" AS "income_alias", "customer"."metadata" AS "metadata_alias" FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT "customer"."id" AS "id_alias", "customer"."name" AS "name_alias", "customer"."age" AS "age_alias", "customer"."income" AS "income_alias", "customer"."metadata" AS "metadata_alias" FROM "customer"',
    string: 'SELECT "customer"."id" AS "id_alias", "customer"."name" AS "name_alias", "customer"."age" AS "age_alias", "customer"."income" AS "income_alias", "customer"."metadata" AS "metadata_alias" FROM "customer"'
  },
  mysql: {
    text :  'SELECT `customer`.`id` AS `id_alias`, `customer`.`name` AS `name_alias`, `customer`.`age` AS `age_alias`, `customer`.`income` AS `income_alias`, `customer`.`metadata` AS `metadata_alias` FROM `customer`',
    string: 'SELECT `customer`.`id` AS `id_alias`, `customer`.`name` AS `name_alias`, `customer`.`age` AS `age_alias`, `customer`.`income` AS `income_alias`, `customer`.`metadata` AS `metadata_alias` FROM `customer`'
  },
  mssql: {
    text  : 'SELECT [customer].[id] AS [id_alias], [customer].[name] AS [name_alias], [customer].[age] AS [age_alias], [customer].[income] AS [income_alias], [customer].[metadata] AS [metadata_alias] FROM [customer]',
    string: 'SELECT [customer].[id] AS [id_alias], [customer].[name] AS [name_alias], [customer].[age] AS [age_alias], [customer].[income] AS [income_alias], [customer].[metadata] AS [metadata_alias] FROM [customer]'
  },
  oracle: {
    text  : 'SELECT "customer"."id" "id_alias", "customer"."name" "name_alias", "customer"."age" "age_alias", "customer"."income" "income_alias", "customer"."metadata" "metadata_alias" FROM "customer"',
    string: 'SELECT "customer"."id" "id_alias", "customer"."name" "name_alias", "customer"."age" "age_alias", "customer"."income" "income_alias", "customer"."metadata" "metadata_alias" FROM "customer"'
  },
  params: []
});

// Test that we can generate a SELECT claus without a FROM clause
Harness.test({
  query: Sql.select(),
  pg: {
    text  : 'SELECT ',
    string: 'SELECT '
  },
  sqlite: {
    text  : 'SELECT ',
    string: 'SELECT '
  },
  mysql: {
    text  : 'SELECT ',
    string: 'SELECT '
  },
  mssql: {
    text  : 'SELECT ',
    string: 'SELECT '
  },
  oracle: {
    text  : 'SELECT ',
    string: 'SELECT '
  },
  params: []
});

// Test that we can generate a SELECT claus without a FROM clause
Harness.test({
  query: Sql.select("1"),
  pg: {
    text  : 'SELECT 1',
    string: 'SELECT 1'
  },
  sqlite: {
    text  : 'SELECT 1',
    string: 'SELECT 1'
  },
  mysql: {
    text  : 'SELECT 1',
    string: 'SELECT 1'
  },
  mssql: {
    text  : 'SELECT 1',
    string: 'SELECT 1'
  },
  oracle: {
    text  : 'SELECT 1',
    string: 'SELECT 1'
  },
  params: []
});

Harness.test({
  query: Sql.select("1").where("1=1"),
  pg: {
    text  : 'SELECT 1 WHERE (1=1)',
    string: 'SELECT 1 WHERE (1=1)'
  },
  sqlite: {
    text  : 'SELECT 1 WHERE (1=1)',
    string: 'SELECT 1 WHERE (1=1)'
  },
  mysql: {
    text  : 'SELECT 1 WHERE (1=1)',
    string: 'SELECT 1 WHERE (1=1)'
  },
  mssql: {
    text  : 'SELECT 1 WHERE (1=1)',
    string: 'SELECT 1 WHERE (1=1)'
  },
  oracle: {
    text  : 'SELECT 1 WHERE (1=1)',
    string: 'SELECT 1 WHERE (1=1)'
  },
  params: []
});

Harness.test({
  query: Sql.select(post.select(post.id)),
  pg: {
    text  : 'SELECT (SELECT "post"."id" FROM "post")',
    string: 'SELECT (SELECT "post"."id" FROM "post")'
  },
  sqlite: {
    text  : 'SELECT (SELECT "post"."id" FROM "post")',
    string: 'SELECT (SELECT "post"."id" FROM "post")'
  },
  mysql: {
    text  : 'SELECT (SELECT `post`.`id` FROM `post`)',
    string: 'SELECT (SELECT `post`.`id` FROM `post`)'
  },
  mssql: {
    text  : 'SELECT (SELECT [post].[id] FROM [post])',
    string: 'SELECT (SELECT [post].[id] FROM [post])'
  },
  oracle: {
    text  : 'SELECT (SELECT "post"."id" FROM "post")',
    string: 'SELECT (SELECT "post"."id" FROM "post")'
  },
  params: []
});

Harness.test({
  query: Sql.select(post.select(post.content).plus(post.select(post.content))),
  pg: {
    text  : 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))',
    string: 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))'
  },
  sqlite: {
    text  : 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))',
    string: 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))'
  },
  mysql: {
    text  : 'SELECT ((SELECT `post`.`content` FROM `post`) + (SELECT `post`.`content` FROM `post`))',
    string: 'SELECT ((SELECT `post`.`content` FROM `post`) + (SELECT `post`.`content` FROM `post`))'
  },
  mssql: {
    text  : 'SELECT ((SELECT [post].[content] FROM [post]) + (SELECT [post].[content] FROM [post]))',
    string: 'SELECT ((SELECT [post].[content] FROM [post]) + (SELECT [post].[content] FROM [post]))'
  },
  oracle: {
    text  : 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))',
    string: 'SELECT ((SELECT "post"."content" FROM "post") + (SELECT "post"."content" FROM "post"))'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.as('col1')),
  pg: {
    text  : 'SELECT "post"."id" AS "col1" FROM "post"',
    string: 'SELECT "post"."id" AS "col1" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT "post"."id" AS "col1" FROM "post"',
    string: 'SELECT "post"."id" AS "col1" FROM "post"'
  },
  mysql: {
    text  : 'SELECT `post`.`id` AS `col1` FROM `post`',
    string: 'SELECT `post`.`id` AS `col1` FROM `post`'
  },
  mssql: {
    text  : 'SELECT [post].[id] AS [col1] FROM [post]',
    string: 'SELECT [post].[id] AS [col1] FROM [post]'
  },
  oracle: {
    text  : 'SELECT "post"."id" "col1" FROM "post"',
    string: 'SELECT "post"."id" "col1" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(Sql.constant(4)),
  pg: {
    text  : 'SELECT $1 FROM "post"',
    string: 'SELECT 4 FROM "post"'
  },
  sqlite: {
    text  : 'SELECT $1 FROM "post"',
    string: 'SELECT 4 FROM "post"'
  },
  mysql: {
    text  : 'SELECT ? FROM `post`',
    string: 'SELECT 4 FROM `post`'
  },
  mssql: {
    text  : 'SELECT @1 FROM [post]',
    string: 'SELECT 4 FROM [post]'
  },
  oracle: {
    text  : 'SELECT :1 FROM "post"',
    string: 'SELECT 4 FROM "post"'
  },
  params: [4]
});

Harness.test({
  query: post.select(post.id,Sql.constant(4)),
  pg: {
    text  : 'SELECT "post"."id", $1 FROM "post"',
    string: 'SELECT "post"."id", 4 FROM "post"'
  },
  sqlite: {
    text  : 'SELECT "post"."id", $1 FROM "post"',
    string: 'SELECT "post"."id", 4 FROM "post"'
  },
  mysql: {
    text  : 'SELECT `post`.`id`, ? FROM `post`',
    string: 'SELECT `post`.`id`, 4 FROM `post`'
  },
  mssql: {
    text  : 'SELECT [post].[id], @1 FROM [post]',
    string: 'SELECT [post].[id], 4 FROM [post]'
  },
  oracle: {
    text  : 'SELECT "post"."id", :1 FROM "post"',
    string: 'SELECT "post"."id", 4 FROM "post"'
  },
  params: [4]
});

Harness.test({
  query: post.select(Sql.constant(4).as('col1')),
  pg: {
    text  : 'SELECT $1 AS "col1" FROM "post"',
    string: 'SELECT 4 AS "col1" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT $1 AS "col1" FROM "post"',
    string: 'SELECT 4 AS "col1" FROM "post"'
  },
  mysql: {
    text  : 'SELECT ? AS `col1` FROM `post`',
    string: 'SELECT 4 AS `col1` FROM `post`'
  },
  mssql: {
    text  : 'SELECT @1 AS [col1] FROM [post]',
    string: 'SELECT 4 AS [col1] FROM [post]'
  },
  oracle: {
    text  : 'SELECT :1 "col1" FROM "post"',
    string: 'SELECT 4 "col1" FROM "post"'
  },
  params: [4]
});

Harness.test({
  query: post.select(Sql.constant(4).plus(5)),
  pg: {
    text  : 'SELECT ($1 + $2) FROM "post"',
    string: 'SELECT (4 + 5) FROM "post"'
  },
  sqlite: {
    text  : 'SELECT ($1 + $2) FROM "post"',
    string: 'SELECT (4 + 5) FROM "post"'
  },
  mysql: {
    text  : 'SELECT (? + ?) FROM `post`',
    string: 'SELECT (4 + 5) FROM `post`'
  },
  mssql: {
    text  : 'SELECT (@1 + @2) FROM [post]',
    string: 'SELECT (4 + 5) FROM [post]'
  },
  oracle: {
    text  : 'SELECT (:1 + :2) FROM "post"',
    string: 'SELECT (4 + 5) FROM "post"'
  },
  params: [4,5]
});

Harness.test({
  query: post.select(Sql.constant(4).plus(5).as('col1')),
  pg: {
    text  : 'SELECT ($1 + $2) AS "col1" FROM "post"',
    string: 'SELECT (4 + 5) AS "col1" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT ($1 + $2) AS "col1" FROM "post"',
    string: 'SELECT (4 + 5) AS "col1" FROM "post"'
  },
  mysql: {
    text  : 'SELECT (? + ?) AS `col1` FROM `post`',
    string: 'SELECT (4 + 5) AS `col1` FROM `post`'
  },
  mssql: {
    text  : 'SELECT (@1 + @2) AS [col1] FROM [post]',
    string: 'SELECT (4 + 5) AS [col1] FROM [post]'
  },
  oracle: {
    text  : 'SELECT (:1 + :2) "col1" FROM "post"',
    string: 'SELECT (4 + 5) "col1" FROM "post"'
  },
  params: [4,5]
});

Harness.test({
  query: post.select(Sql.constant(4),Sql.constant("abc"),Sql.constant(true)),
  pg: {
    text  : 'SELECT $1, $2, $3 FROM "post"',
    string: 'SELECT 4, \'abc\', TRUE FROM "post"'
  },
  sqlite: {
    text  : 'SELECT $1, $2, $3 FROM "post"',
    string: 'SELECT 4, \'abc\', 1 FROM "post"'
  },
  mysql: {
    text  : 'SELECT ?, ?, ? FROM `post`',
    string: 'SELECT 4, \'abc\', TRUE FROM `post`'
  },
  mssql: {
    text  : 'SELECT @1, @2, @3 FROM [post]',
    string: 'SELECT 4, \'abc\', TRUE FROM [post]'
  },
  oracle: {
    text  : 'SELECT :1, :2, :3 FROM "post"',
    string: 'SELECT 4, \'abc\', TRUE FROM "post"'
  },
  params: [4,'abc',true]
});

Harness.test({
  query: post.select(Sql.constant(1).sum()),
  pg: {
    text  : 'SELECT SUM($1) AS "constant_sum" FROM "post"',
    string: 'SELECT SUM(1) AS "constant_sum" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUM($1) AS "constant_sum" FROM "post"',
    string: 'SELECT SUM(1) AS "constant_sum" FROM "post"'
  },
  mysql: {
    text  : 'SELECT SUM(?) AS `constant_sum` FROM `post`',
    string: 'SELECT SUM(1) AS `constant_sum` FROM `post`'
  },
  mssql: {
    text  : 'SELECT SUM(@1) AS [constant_sum] FROM [post]',
    string: 'SELECT SUM(1) AS [constant_sum] FROM [post]'
  },
  oracle: {
    text  : 'SELECT SUM(:1) "constant_sum" FROM "post"',
    string: 'SELECT SUM(1) "constant_sum" FROM "post"'
  },
  params: [1]
});

Harness.test({
  query: Sql.select(post.select(post.id).as("column1")),
  pg: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") AS "column1"',
    string: 'SELECT (SELECT "post"."id" FROM "post") AS "column1"'
  },
  sqlite: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") AS "column1"',
    string: 'SELECT (SELECT "post"."id" FROM "post") AS "column1"'
  },
  mysql: {
    text  : 'SELECT (SELECT `post`.`id` FROM `post`) AS `column1`',
    string: 'SELECT (SELECT `post`.`id` FROM `post`) AS `column1`'
  },
  mssql: {
    text  : 'SELECT (SELECT [post].[id] FROM [post]) AS [column1]',
    string: 'SELECT (SELECT [post].[id] FROM [post]) AS [column1]'
  },
  oracle: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") "column1"',
    string: 'SELECT (SELECT "post"."id" FROM "post") "column1"'
  },
  params: []
});

Harness.test({
  query: Sql.select(post.select(post.count()).as("column1")),
  pg: {
    text  : 'SELECT (SELECT COUNT("post".*) AS "post_count" FROM "post") AS "column1"',
    string: 'SELECT (SELECT COUNT("post".*) AS "post_count" FROM "post") AS "column1"'
  },
  sqlite: {
    text  : 'SELECT (SELECT COUNT("post".*) AS "post_count" FROM "post") AS "column1"',
    string: 'SELECT (SELECT COUNT("post".*) AS "post_count" FROM "post") AS "column1"'
  },
  mysql: {
    text  : 'SELECT (SELECT COUNT(*) AS `post_count` FROM `post`) AS `column1`',
    string: 'SELECT (SELECT COUNT(*) AS `post_count` FROM `post`) AS `column1`'
  },
  mssql: {
    text  : 'SELECT (SELECT COUNT(*) AS [post_count] FROM [post]) AS [column1]',
    string: 'SELECT (SELECT COUNT(*) AS [post_count] FROM [post]) AS [column1]'
  },
  oracle: {
    text  : 'SELECT (SELECT COUNT(*) "post_count" FROM "post") "column1"',
    string: 'SELECT (SELECT COUNT(*) "post_count" FROM "post") "column1"'
  },
  params: []
});

Harness.test({
  query: Sql.select(post.select(post.id).as("column1"),user.select(user.id).as("column2")),
  pg: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") AS "column1", (SELECT "user"."id" FROM "user") AS "column2"',
    string: 'SELECT (SELECT "post"."id" FROM "post") AS "column1", (SELECT "user"."id" FROM "user") AS "column2"'
  },
  sqlite: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") AS "column1", (SELECT "user"."id" FROM "user") AS "column2"',
    string: 'SELECT (SELECT "post"."id" FROM "post") AS "column1", (SELECT "user"."id" FROM "user") AS "column2"'
  },
  mysql: {
    text  : 'SELECT (SELECT `post`.`id` FROM `post`) AS `column1`, (SELECT `user`.`id` FROM `user`) AS `column2`',
    string: 'SELECT (SELECT `post`.`id` FROM `post`) AS `column1`, (SELECT `user`.`id` FROM `user`) AS `column2`'
  },
  mssql: {
    text  : 'SELECT (SELECT [post].[id] FROM [post]) AS [column1], (SELECT [user].[id] FROM [user]) AS [column2]',
    string: 'SELECT (SELECT [post].[id] FROM [post]) AS [column1], (SELECT [user].[id] FROM [user]) AS [column2]'
  },
  oracle: {
    text  : 'SELECT (SELECT "post"."id" FROM "post") "column1", (SELECT "user"."id" FROM "user") "column2"',
    string: 'SELECT (SELECT "post"."id" FROM "post") "column1", (SELECT "user"."id" FROM "user") "column2"'
  },
  params: []
});


