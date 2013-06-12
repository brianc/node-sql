'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.userId.appendText('::string')).where(post.userId.appendText(' IS NOT NULL')),
  pg    : 'SELECT "post"."userId"::string FROM "post" WHERE "post"."userId" IS NOT NULL',
  sqlite: 'SELECT "post"."userId"::string FROM "post" WHERE "post"."userId" IS NOT NULL',
  mysql : 'SELECT `post`.`userId`::string FROM `post` WHERE `post`.`userId` IS NOT NULL'
});
