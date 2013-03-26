'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.content).order(post.content),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"',
  sqlite: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"',
  mysql : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`'
});

Harness.test({
  query : post.select(post.content).order(post.content, post.userId.descending),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  sqlite: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  mysql : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
});

Harness.test({
  query : post.select(post.content).order(post.content.asc, post.userId.desc),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  sqlite: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  mysql : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
});

Harness.test({
  query : post.select(post.content).order([post.content, post.userId.descending]),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  sqlite: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
  mysql : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
});
