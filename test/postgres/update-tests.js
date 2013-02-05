var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();

Harness.test({
  query : post.update({content: 'test'}),
  pg    : 'UPDATE "post" SET "content" = $1',
  params: ['test']
});

Harness.test({
  query : post.update({content: 'test', userId: 3}),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2',
  params: ['test', 3]
});

Harness.test({
  query : post.update({content: null, userId: 3}),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2',
  params: [null, 3]
});

Harness.test({
  query : post.update({content: 'test', userId: 3}).where(post.content.equals('no')),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2 WHERE ("post"."content" = $3)',
  params: ['test', 3, 'no']
});

Harness.test({
  query : post.update({content: user.name}).from(user).where(post.userId.equals(user.id)),
  pg    : 'UPDATE "post" SET "content" = "name" FROM "user" WHERE ("post"."userId" = "user"."id")',
  params: []
});

