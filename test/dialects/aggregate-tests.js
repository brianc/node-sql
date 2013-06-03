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

Harness.test({
  query : post.select(post.id.min()),
  pg    : 'SELECT MIN("post"."id") AS "id_min" FROM "post"',
  sqlite: 'SELECT MIN("post"."id") AS "id_min" FROM "post"',
  mysql : 'SELECT MIN(`post`.`id`) AS `id_min` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.id.min().as('min_id')),
  pg    : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
  sqlite: 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
  mysql : 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.id.min('min_id')),
  pg    : 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
  sqlite: 'SELECT MIN("post"."id") AS "min_id" FROM "post"',
  mysql : 'SELECT MIN(`post`.`id`) AS `min_id` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.id.max()),
  pg    : 'SELECT MAX("post"."id") AS "id_max" FROM "post"',
  sqlite: 'SELECT MAX("post"."id") AS "id_max" FROM "post"',
  mysql : 'SELECT MAX(`post`.`id`) AS `id_max` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.id.max().as('max_id')),
  pg    : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
  sqlite: 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
  mysql : 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`',
  params: []
});

Harness.test({
  query : post.select(post.id.max('max_id')),
  pg    : 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
  sqlite: 'SELECT MAX("post"."id") AS "max_id" FROM "post"',
  mysql : 'SELECT MAX(`post`.`id`) AS `max_id` FROM `post`',
  params: []
});

Harness.test({ 
  query   : post.select(post.id.sum()),
  pg      : 'SELECT SUM("post"."id") AS "id_sum" FROM "post"',
  sqllite : 'SELECT SUM("post"."id") AS "id_sum" FROM "post"',
  mysql   : 'SELECT SUM(`post`.`id`) AS `id_sum` FROM `post`',
});

Harness.test({ 
  query   : post.select(post.id.sum().as('sum_id')),
  pg      : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
  sqllite : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
  mysql   : 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`',
});

Harness.test({ 
  query   : post.select(post.id.sum('sum_id')),
  pg      : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
  sqllite : 'SELECT SUM("post"."id") AS "sum_id" FROM "post"',
  mysql   : 'SELECT SUM(`post`.`id`) AS `sum_id` FROM `post`',
});

Harness.test({ 
  query   : post.select(post.id.avg()),
  pg      : 'SELECT AVG("post"."id") AS "id_avg" FROM "post"',
  sqllite : 'SELECT AVG("post"."id") AS "id_avg" FROM "post"',
  mysql   : 'SELECT AVG(`post`.`id`) AS `id_avg` FROM `post`',
});

Harness.test({ 
  query   : post.select(post.id.avg().as('avg_id')),
  pg      : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
  sqllite : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
  mysql   : 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`',
});

Harness.test({ 
  query   : post.select(post.id.avg('avg_id')),
  pg      : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
  sqllite : 'SELECT AVG("post"."id") AS "avg_id" FROM "post"',
  mysql   : 'SELECT AVG(`post`.`id`) AS `avg_id` FROM `post`',
});

