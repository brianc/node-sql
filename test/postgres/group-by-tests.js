var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.content).group(post.userId),
  pg    : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId"'
});

Harness.test({
  query : post.select(post.content).group(post.userId, post.id),
  pg    : 'SELECT "post"."content" FROM "post" GROUP BY "post"."userId", "post"."id"'
});

Harness.test({
  query : post.select(post.content.arrayAgg()).group(post.userId),
  pg    : 'SELECT array_agg("post"."content") as "contents" FROM "post" GROUP BY "post"."userId"'
});

Harness.test({
  query : post.select(post.content.arrayAgg('post contents')).group(post.userId),
  pg    : 'SELECT array_agg("post"."content") as "post contents" FROM "post" GROUP BY "post"."userId"'
});
