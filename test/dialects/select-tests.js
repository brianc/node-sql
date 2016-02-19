'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
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
