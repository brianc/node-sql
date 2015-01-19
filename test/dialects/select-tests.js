'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var customerAlias = Harness.defineCustomerAliasTable();

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
  params: []
});