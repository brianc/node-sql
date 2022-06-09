'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var customerAlias = Harness.defineCustomerAliasTable();


Harness.test({
  query: post.select(post.count()),
  pg: {
    text  : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_count" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_count" FROM "post"'
  },
  mysql: {
    text  : 'SELECT COUNT(*) AS `post_count` FROM `post`',
    string: 'SELECT COUNT(*) AS `post_count` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT(*) AS [post_count] FROM [post]',
    string: 'SELECT COUNT(*) AS [post_count] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT(*) "post_count" FROM "post"',
    string: 'SELECT COUNT(*) "post_count" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.count('post_count')),
  pg: {
    text  : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_count" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_count" FROM "post"'
  },
  msyql: {
    text  : 'SELECT COUNT(*) AS `post_count` FROM `post`',
    string: 'SELECT COUNT(*) AS `post_count` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT(*) AS [post_count] FROM [post]',
    string: 'SELECT COUNT(*) AS [post_count] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT(*) "post_count" FROM "post"',
    string: 'SELECT COUNT(*) "post_count" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.count().as('post_amount')),
  pg: {
    text  : 'SELECT COUNT("post".*) AS "post_amount" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_amount" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post".*) AS "post_amount" FROM "post"',
    string: 'SELECT COUNT("post".*) AS "post_amount" FROM "post"'
  },
  mysql: {
    text  : 'SELECT COUNT(*) AS `post_amount` FROM `post`',
    string: 'SELECT COUNT(*) AS `post_amount` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT(*) AS [post_amount] FROM [post]',
    string: 'SELECT COUNT(*) AS [post_amount] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT(*) "post_amount" FROM "post"',
    string: 'SELECT COUNT(*) "post_amount" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.count()),
  pg: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  mysql: {
    text  : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
    string: 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]',
    string: 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT("post"."content") "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") "content_count" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.count('content_count')),
  pg: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  mysql: {
    text  : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
    string: 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]',
    string: 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT("post"."content") "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") "content_count" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.count().as('content_count')),
  pg: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"'
  },
  mysql: {
    text  : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
    string: 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`'
  },
  mssql: {
    text  : 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]',
    string: 'SELECT COUNT([post].[content]) AS [content_count] FROM [post]'
  },
  oracle: {
    text  : 'SELECT COUNT("post"."content") "content_count" FROM "post"',
    string: 'SELECT COUNT("post"."content") "content_count" FROM "post"'
  },
  params: []
});

Harness.test({
  query: customerAlias.select(customerAlias.count()),
  pg: {
    text  : 'SELECT COUNT("customer".*) AS "customer_count" FROM "customer"',
    string: 'SELECT COUNT("customer".*) AS "customer_count" FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT COUNT("customer".*) AS "customer_count" FROM "customer"',
    string: 'SELECT COUNT("customer".*) AS "customer_count" FROM "customer"'
  },
  mysql: {
    text  : 'SELECT COUNT(*) AS `customer_count` FROM `customer`',
    string: 'SELECT COUNT(*) AS `customer_count` FROM `customer`'
  },
  oracle: {
    text  : 'SELECT COUNT(*) "customer_count" FROM "customer"',
    string: 'SELECT COUNT(*) "customer_count" FROM "customer"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.min()),
  pg: {
    text  : 'SELECT MIN("post"."id") AS "id_min" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "id_min" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MIN("post"."id") AS "id_min" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "id_min" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MIN(`post`.`id`) AS `id_min` FROM `post`',
    string: 'SELECT MIN(`post`.`id`) AS `id_min` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MIN([post].[id]) AS [id_min] FROM [post]',
    string: 'SELECT MIN([post].[id]) AS [id_min] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MIN("post"."id") "id_min" FROM "post"',
    string: 'SELECT MIN("post"."id") "id_min" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.min().as('min_id')),
  pg: {
    text  : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "min_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "min_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`',
    string: 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MIN([post].[id]) AS [min_id] FROM [post]',
    string: 'SELECT MIN([post].[id]) AS [min_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MIN("post"."id") "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") "min_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.min('min_id')),
  pg: {
    text  : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "min_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") AS "min_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`',
    string: 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MIN([post].[id]) AS [min_id] FROM [post]',
    string: 'SELECT MIN([post].[id]) AS [min_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MIN("post"."id") "min_id" FROM "post"',
    string: 'SELECT MIN("post"."id") "min_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.max()),
  pg: {
    text  : 'SELECT MAX("post"."id") AS "id_max" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "id_max" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MAX("post"."id") AS "id_max" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "id_max" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MAX(`post`.`id`) AS `id_max` FROM `post`',
    string: 'SELECT MAX(`post`.`id`) AS `id_max` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MAX([post].[id]) AS [id_max] FROM [post]',
    string: 'SELECT MAX([post].[id]) AS [id_max] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MAX("post"."id") "id_max" FROM "post"',
    string: 'SELECT MAX("post"."id") "id_max" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.max().as('max_id')),
  pg: {
    text  : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "max_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "max_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`',
    string: 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MAX([post].[id]) AS [max_id] FROM [post]',
    string: 'SELECT MAX([post].[id]) AS [max_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MAX("post"."id") "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") "max_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.max('max_id')),
  pg: {
    text  : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "max_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") AS "max_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`',
    string: 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT MAX([post].[id]) AS [max_id] FROM [post]',
    string: 'SELECT MAX([post].[id]) AS [max_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT MAX("post"."id") "max_id" FROM "post"',
    string: 'SELECT MAX("post"."id") "max_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.sum()),
  pg: {
    text  : 'SELECT SUM("post"."id") AS "id_sum" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "id_sum" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUM("post"."id") AS "id_sum" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "id_sum" FROM "post"'
  },
  mysql: {
    text  : 'SELECT SUM(`post`.`id`) AS `id_sum` FROM `post`',
    string: 'SELECT SUM(`post`.`id`) AS `id_sum` FROM `post`'
  },
  mssql: {
    text  : 'SELECT SUM([post].[id]) AS [id_sum] FROM [post]',
    string: 'SELECT SUM([post].[id]) AS [id_sum] FROM [post]'
  },
  oracle: {
    text  : 'SELECT SUM("post"."id") "id_sum" FROM "post"',
    string: 'SELECT SUM("post"."id") "id_sum" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.sum().as('sum_id')),
  pg: {
    text  : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "sum_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "sum_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`',
    string: 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT SUM([post].[id]) AS [sum_id] FROM [post]',
    string: 'SELECT SUM([post].[id]) AS [sum_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT SUM("post"."id") "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") "sum_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.sum('sum_id')),
  pg: {
    text  : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "sum_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") AS "sum_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`',
    string: 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT SUM([post].[id]) AS [sum_id] FROM [post]',
    string: 'SELECT SUM([post].[id]) AS [sum_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT SUM("post"."id") "sum_id" FROM "post"',
    string: 'SELECT SUM("post"."id") "sum_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.avg()),
  pg: {
    text  : 'SELECT AVG("post"."id") AS "id_avg" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "id_avg" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT AVG("post"."id") AS "id_avg" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "id_avg" FROM "post"'
  },
  mysql: {
    text  : 'SELECT AVG(`post`.`id`) AS `id_avg` FROM `post`',
    string: 'SELECT AVG(`post`.`id`) AS `id_avg` FROM `post`'
  },
  mssql: {
    text  : 'SELECT AVG([post].[id]) AS [id_avg] FROM [post]',
    string: 'SELECT AVG([post].[id]) AS [id_avg] FROM [post]'
  },
  oracle: {
    text  : 'SELECT AVG("post"."id") "id_avg" FROM "post"',
    string: 'SELECT AVG("post"."id") "id_avg" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.avg().as('avg_id')),
  pg: {
    text  : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "avg_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "avg_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`',
    string: 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT AVG([post].[id]) AS [avg_id] FROM [post]',
    string: 'SELECT AVG([post].[id]) AS [avg_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT AVG("post"."id") "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") "avg_id" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.id.avg('avg_id')),
  pg: {
    text  : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "avg_id" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") AS "avg_id" FROM "post"'
  },
  mysql: {
    text  : 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`',
    string: 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`'
  },
  mssql: {
    text  : 'SELECT AVG([post].[id]) AS [avg_id] FROM [post]',
    string: 'SELECT AVG([post].[id]) AS [avg_id] FROM [post]'
  },
  oracle: {
    text  : 'SELECT AVG("post"."id") "avg_id" FROM "post"',
    string: 'SELECT AVG("post"."id") "avg_id" FROM "post"'
  },
  params: []
});
