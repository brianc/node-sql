'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.userId.appendText('::string')).where(post.userId.appendText('  ').equals('1')),
  pg    : 'SELECT "post"."userId"::string FROM "post" WHERE ("post"."userId"   = $1)',
  sqlite: 'SELECT "post"."userId"::string FROM "post" WHERE ("post"."userId"   = $1)',
  mysql : 'SELECT `post`.`userId`::string FROM `post` WHERE (`post`.`userId`   = ?)'
});
