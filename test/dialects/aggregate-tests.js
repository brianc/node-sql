'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.count()),
  pg    : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
  sqlite: 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
  mysql : 'SELECT COUNT(`post`.*) AS `post_count` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.count('post_count')),
  pg    : 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
  sqlite: 'SELECT COUNT("post".*) AS "post_count" FROM "post"',
  msyql : 'SELECT COUNT(`post`.*) AS `post_count` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.count().as('post_amount')),
  pg    : 'SELECT COUNT("post".*) AS "post_amount" FROM "post"',
  sqlite: 'SELECT COUNT("post".*) AS "post_amount" FROM "post"',
  mysql : 'SELECT COUNT(`post`.*) AS `post_amount` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.content.count()),
  pg    : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  sqlite: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  mysql : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.content.count('content_count')),
  pg    : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  sqlite: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  mysql : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.content.count().as('content_count')),
  pg    : 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  sqlite: 'SELECT COUNT("post"."content") AS "content_count" FROM "post"',
  mysql : 'SELECT COUNT(`post`.`content`) AS `content_count` FROM `post`',
  params: []
});
