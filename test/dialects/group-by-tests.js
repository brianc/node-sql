'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.content).group(post.userId),
  pg    : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"',
  sqlite: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"',
  mysql : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`',
  params: []
});

Harness.test({
  query : post.select(post.content).group(post.userId, post.id),
  pg    : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
  sqlite: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
  mysql : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`',
  params: []
});

Harness.test({
  query : post.select(post.content.arrayAgg()).group(post.userId),
  pg    : 'SELECT array_agg("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"',
  sqlite: 'SELECT GROUP_CONCAT("post"."content") AS "contents" FROM "post" GROUP BY "post"."userId"',
  mysql : 'SELECT GROUP_CONCAT(`post`.`content`) AS `contents` FROM `post` GROUP BY `post`.`userId`',
  params: []
});

Harness.test({
  query : post.select(post.content.arrayAgg('post contents')).group(post.userId),
  pg    : 'SELECT array_agg("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"',
  sqlite: 'SELECT GROUP_CONCAT("post"."content") AS "post contents" FROM "post" GROUP BY "post"."userId"',
  mysql : 'SELECT GROUP_CONCAT(`post`.`content`) AS `post contents` FROM `post` GROUP BY `post`.`userId`',
  params: []
});

Harness.test({
  query : post.select(post.content).group([post.userId, post.id]),
  pg    : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
  sqlite: 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"',
  mysql : 'SELECT `post`.`content` FROM `post` GROUP BY `post`.`userId`, `post`.`id`',
  params: []
});
