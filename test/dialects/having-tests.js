'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having(post.userId.gt(10)),
  pg    : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1)',
  sqlite: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1)',
  mysql : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?)',
  params: [10]
});

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having(post.userId.gt(10), post.userId.lt(100)),
  pg    : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
  sqlite: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
  mysql : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?) AND (`post`.`userId` < ?)',
  params: [10, 100]
});

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having([post.userId.gt(10), post.userId.lt(100)]),
  pg    : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
  sqlite: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
  mysql : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?) AND (`post`.`userId` < ?)',
  params: [10, 100]
});
