'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.id).select(post.content),
  pg    : 'SELECT "post"."id", "post"."content" FROM "post"',
  sqlite: 'SELECT "post"."id", "post"."content" FROM "post"',
  mysql : 'SELECT `post`.`id`, `post`.`content` FROM `post`'
});
