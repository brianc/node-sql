'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.count()),
  pg    : 'SELECT COUNT("post".*) as "post_count" FROM "post"'
});

Harness.test({
  query : post.select(post.count('post_count')),
  pg    : 'SELECT COUNT("post".*) as "post_count" FROM "post"'
});

Harness.test({
  query : post.select(post.count().as('post_amount')),
  pg    : 'SELECT COUNT("post".*) as "post_amount" FROM "post"'
});

Harness.test({
  query : post.select(post.content.count()),
  pg    : 'SELECT COUNT("post"."content") as "content_count" FROM "post"'
});

Harness.test({
  query : post.select(post.content.count('content_count')),
  pg    : 'SELECT COUNT("post"."content") as "content_count" FROM "post"'
});

Harness.test({
  query : post.select(post.content.count().as('content_count')),
  pg    : 'SELECT COUNT("post"."content") as "content_count" FROM "post"'
});
