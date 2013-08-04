'use strict';

var Harness = require('./support');
var post    = Harness.definePostTable();
var sql     = require('../../lib');

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

Harness.test({
  query: post.select(post.content.isNull()).order(post.content.isNull()),
  pg: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)'
  },
  mysql: {
    text  : 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL)',
    string: 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.isNull()).order(post.content.isNull().descending()),
  pg: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL) DESC',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL) DESC'
  },
  sqlite: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL) DESC',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL) DESC'
  },
  mysql: {
    text  : 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL) DESC',
    string: 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL) DESC'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.isNull()).order(post.content.isNull()),
  pg: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)',
    string: 'SELECT ("post"."content" IS NULL) FROM "post" ORDER BY ("post"."content" IS NULL)'
  },
  mysql: {
    text  : 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL)',
    string: 'SELECT (`post`.`content` IS NULL) FROM `post` ORDER BY (`post`.`content` IS NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(sql.functions.RTRIM(post.content)).order(sql.functions.RTRIM(post.content)),
  pg: {
    text  : 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content")',
    string: 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content")'
  },
  sqlite: {
    text  : 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content")',
    string: 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content")'
  },
  mysql: {
    text  : 'SELECT RTRIM(`post`.`content`) FROM `post` ORDER BY RTRIM(`post`.`content`)',
    string: 'SELECT RTRIM(`post`.`content`) FROM `post` ORDER BY RTRIM(`post`.`content`)'
  },
  params: []
});

Harness.test({
  query: post.select(sql.functions.RTRIM(post.content)).order(sql.functions.RTRIM(post.content).descending()),
  pg: {
    text  : 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content") DESC',
    string: 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content") DESC'
  },
  sqlite: {
    text  : 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content") DESC',
    string: 'SELECT RTRIM("post"."content") FROM "post" ORDER BY RTRIM("post"."content") DESC'
  },
  mysql: {
    text  : 'SELECT RTRIM(`post`.`content`) FROM `post` ORDER BY RTRIM(`post`.`content`) DESC',
    string: 'SELECT RTRIM(`post`.`content`) FROM `post` ORDER BY RTRIM(`post`.`content`) DESC'
  },
  params: []
});
