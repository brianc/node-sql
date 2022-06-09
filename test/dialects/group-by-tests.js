'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.select(post.content).group(post.userId),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`',
    string: 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`'
  },
  mssql: {
    text  : 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId]',
    string: 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId]'
  },
  oracle: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).group(post.userId, post.id),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`',
    string: 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`'
  },
  mssql: {
    text  : 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId], [post].[id]',
    string: 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId], [post].[id]'
  },
  oracle: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.arrayAgg()).group(post.userId),
  pg: {
    text  : 'SELECT array_agg("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT array_agg("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"'
  },
  sqlite: {
    text  : 'SELECT GROUP_CONCAT("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT GROUP_CONCAT("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"'
  },
  mysql: {
    text  : 'SELECT GROUP_CONCAT(`post`.`content`) AS `contents` FROM `post` GROUP BY `post`.`userId`',
    string: 'SELECT GROUP_CONCAT(`post`.`content`) AS `contents` FROM `post` GROUP BY `post`.`userId`'
  },
  mssql: {
    text  : 'SQL Server does not support array_agg.',
    throws: true
  },
  oracle: {
    text  : 'Oracle does not support array_agg.',
    throws: true
  },
  params: []
});

Harness.test({
  query: post.select(post.content.arrayAgg('post contents')).group(post.userId),
  pg: {
    text  : 'SELECT array_agg("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT array_agg("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"'
  },
  sqlite: {
    text  : 'SELECT GROUP_CONCAT("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"',
    string: 'SELECT GROUP_CONCAT("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"'
  },
  mysql: {
    text  : 'SELECT GROUP_CONCAT(`post`.`content`) AS `post contents` FROM `post` GROUP BY `post`.`userId`',
    string: 'SELECT GROUP_CONCAT(`post`.`content`) AS `post contents` FROM `post` GROUP BY `post`.`userId`'
  },
  mssql: {
    text  : 'SQL Server does not support array_agg.',
    throws: true
  },
  oracle: {
    text  : 'Oracle does not support array_agg.',
    throws: true
  },
  params: []
});

Harness.test({
  query: post.select(post.content).group([post.userId, post.id]),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`',
    string: 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`'
  },
  mssql: {
    text  : 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId], [post].[id]',
    string: 'SELECT [post].[content] FROM [post] GROUP BY [post].[userId], [post].[id]'
  },
  oracel: {
    text  : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
    string: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
  },
  params: []
});
