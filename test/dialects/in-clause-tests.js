'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.select(post.star()).where(post.id.in([])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE (1=0)',
    string: 'SELECT "post".* FROM "post" WHERE (1=0)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE (1=0)',
    string: 'SELECT "post".* FROM "post" WHERE (1=0)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (1=0)',
    string: 'SELECT `post`.* FROM `post` WHERE (1=0)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([1])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (?))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (1))'
  },
  params: [1]
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([1, 2])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (?, ?))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (1, 2))'
  },
  params: [1, 2]
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([null, null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([1, null, 2])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2) OR "post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2) OR "post"."id" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2) OR "post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2) OR "post"."id" IS NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (?, ?) OR `post`.`id` IS NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (1, 2) OR `post`.`id` IS NULL)'
  },
  params: [1, 2]
});

Harness.test({
  query: post.select(post.star()).where(post.id.in([1, null, 2, null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2) OR "post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2) OR "post"."id" IS NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IN ($1, $2) OR "post"."id" IS NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IN (1, 2) OR "post"."id" IS NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (?, ?) OR `post`.`id` IS NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IN (1, 2) OR `post`.`id` IS NULL)'
  },
  params: [1, 2]
});
