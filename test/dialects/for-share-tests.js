'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();

Harness.test({
  query: post.select(post.star()).forShare(),
  pg: {
    text  : 'SELECT "post".* FROM "post" FOR SHARE',
    string: 'SELECT "post".* FROM "post" FOR SHARE'
  },
  params: []
});

Harness.test({
  query: post.select(post.star()).from(post.join(user).on(user.id.equals(post.userId))).where(post.content.equals('foo')).forShare(),
  pg: {
    text  : 'SELECT "post".* FROM "post" INNER JOIN "user" ON ("user"."id" = "post"."userId") WHERE ("post"."content" = $1) FOR SHARE',
    string: 'SELECT "post".* FROM "post" INNER JOIN "user" ON ("user"."id" = "post"."userId") WHERE ("post"."content" = \'foo\') FOR SHARE'
  },
  params: ["foo"]
});
