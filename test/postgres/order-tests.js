var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

Harness.test({
  query : post.select(post.content).order(post.content),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content"'
});

Harness.test({
  query : post.select(post.content).order(post.content, post.userId.descending),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", ("post"."userId"  DESC)'
});

Harness.test({
  query : post.select(post.content).order(post.content.asc, post.userId.desc),
  pg    : 'SELECT "post"."content" FROM "post" ORDER BY "post"."content", ("post"."userId"  DESC)'
});
