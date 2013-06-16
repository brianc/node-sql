'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having(post.userId.gt(10)),
  pg    : {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10)'
  },
  sqlite: {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10)'
  },
  mysql : {
    text  : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?)',
    string: 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > 10)'
  },
  params: [10]
});

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having(post.userId.gt(10), post.userId.lt(100)),
  pg    : {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10) AND ("post"."userId" < 100)'
  },
  sqlite: {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10) AND ("post"."userId" < 100)'
  },
  mysql : {
    text  : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?) AND (`post`.`userId` < ?)',
    string: 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > 10) AND (`post`.`userId` < 100)'
  },
  params: [10, 100]
});

Harness.test({
  query : post.select(post.userId, post.content.count()).group(post.userId).having([post.userId.gt(10), post.userId.lt(100)]),
  pg    : {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10) AND ("post"."userId" < 100)'
  },
  sqlite: {
    text  : 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > $1) AND ("post"."userId" < $2)',
    string: 'SELECT "post"."userId", COUNT("post"."content") AS "content_count" FROM "post" GROUP BY "post"."userId" HAVING ("post"."userId" > 10) AND ("post"."userId" < 100)'
  },
  mysql : {
    text  : 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > ?) AND (`post`.`userId` < ?)',
    string: 'SELECT `post`.`userId`, COUNT(`post`.`content`) AS `content_count` FROM `post` GROUP BY `post`.`userId` HAVING (`post`.`userId` > 10) AND (`post`.`userId` < 100)'
  },
  params: [10, 100]
});
