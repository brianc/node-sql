'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE (1=1)',
    string: 'SELECT "post".* FROM "post" WHERE (1=1)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE (1=1)',
    string: 'SELECT "post".* FROM "post" WHERE (1=1)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (1=1)',
    string: 'SELECT `post`.* FROM `post` WHERE (1=1)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([1])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN ($1))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN (1))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN ($1))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN (1))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` NOT IN (?))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` NOT IN (1))'
  },
  params: [1]
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NOT NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NOT NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([1, 2])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN ($1, $2))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN (1, 2))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN ($1, $2))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" NOT IN (1, 2))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` NOT IN (?, ?))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` NOT IN (1, 2))'
  },
  params: [1, 2]
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([null, null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."id" IS NOT NULL)'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NOT NULL)',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`id` IS NOT NULL)'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([1, null, 2])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN ($1, $2) OR "post"."id" IS NULL))',
    string: 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN (1, 2) OR "post"."id" IS NULL))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN ($1, $2) OR "post"."id" IS NULL))',
    string: 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN (1, 2) OR "post"."id" IS NULL))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (NOT (`post`.`id` IN (?, ?) OR `post`.`id` IS NULL))',
    string: 'SELECT `post`.* FROM `post` WHERE (NOT (`post`.`id` IN (1, 2) OR `post`.`id` IS NULL))'
  },
  params: [1, 2]
});

Harness.test({
  query: post.select(post.star()).where(post.id.notIn([1, null, 2, null])),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN ($1, $2) OR "post"."id" IS NULL))',
    string: 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN (1, 2) OR "post"."id" IS NULL))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN ($1, $2) OR "post"."id" IS NULL))',
    string: 'SELECT "post".* FROM "post" WHERE (NOT ("post"."id" IN (1, 2) OR "post"."id" IS NULL))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (NOT (`post`.`id` IN (?, ?) OR `post`.`id` IS NULL))',
    string: 'SELECT `post`.* FROM `post` WHERE (NOT (`post`.`id` IN (1, 2) OR `post`.`id` IS NULL))'
  },
  params: [1, 2]
});
