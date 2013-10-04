'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var sql = require('../../lib');

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

Harness.test({
  query: post.select(post.id).select(post.content).select(sql.value(4)),
  pg: {
    text  : 'SELECT "post"."id", "post"."content", $1 FROM "post"',
    string: 'SELECT "post"."id", "post"."content", 4 FROM "post"'
  },
  sqlite: {
    text  : 'SELECT "post"."id", "post"."content", $1 FROM "post"',
    string: 'SELECT "post"."id", "post"."content", 4 FROM "post"'
  },
  mysql: {
    text  : 'SELECT `post`.`id`, `post`.`content`, ? FROM `post`',
    string: 'SELECT `post`.`id`, `post`.`content`, 4 FROM `post`'
  },
  params: [4]
});
