'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.select(post.content).order(post.content),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`',
    string: 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).order(post.content, post.userId.descending),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC',
    string: 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).order(post.content.asc, post.userId.desc),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC',
    string: 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).order([post.content, post.userId.descending]),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC',
    string: 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).order(post.content).order(post.userId.descending),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC',
    string: 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", "post"."userId" DESC'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC',
    string: 'SELECT `post`.`content` FROM `post` ORDER BY `post`.`content`, `post`.`userId` DESC'
  },
  params: []
});
