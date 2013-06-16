'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

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
  params: []
});
