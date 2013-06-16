'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.delete().where(post.content.equals("hello's world")),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'hello\'\'s world\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'hello\'\'s world\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'hello\'\'s world\')'
  },
  params: ["hello's world"]
});

Harness.test({
  query: post.delete().where({
    content: ''
  }),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'\')'
  },
  params: ['']
});

Harness.test({
  query: post.delete({
    content: ''
  }),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'\')'
  },
  params: ['']
});

Harness.test({
  query: post.delete({
    content: ''
  }).or(post.content.isNull()),
  pg: {
    text  : 'DELETE FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
    string: 'DELETE FROM "post" WHERE (("post"."content" = \'\') OR ("post"."content" IS NULL))'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
    string: 'DELETE FROM "post" WHERE (("post"."content" = \'\') OR ("post"."content" IS NULL))'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE ((`post`.`content` = ?) OR (`post`.`content` IS NULL))',
    string: 'DELETE FROM `post` WHERE ((`post`.`content` = \'\') OR (`post`.`content` IS NULL))'
  },
  params: ['']
});
