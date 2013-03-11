'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();

Harness.test({
  query : post.update({content: 'test'}),
  pg    : 'UPDATE "post" SET "content" = $1',
  sqlite: 'UPDATE "post" SET "content" = $1',
  mysql : 'UPDATE `post` SET `content` = ?',
  params: ['test']
});

Harness.test({
  query : post.update({content: 'test', userId: 3}),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2',
  sqlite: 'UPDATE "post" SET "content" = $1, "userId" = $2',
  mysql : 'UPDATE `post` SET `content` = ?, `userId` = ?',
  params: ['test', 3]
});

Harness.test({
  query : post.update({content: null, userId: 3}),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2',
  sqlite: 'UPDATE "post" SET "content" = $1, "userId" = $2',
  mysql : 'UPDATE `post` SET `content` = ?, `userId` = ?',
  params: [null, 3]
});

Harness.test({
  query : post.update({content: 'test', userId: 3}).where(post.content.equals('no')),
  pg    : 'UPDATE "post" SET "content" = $1, "userId" = $2 WHERE ("post"."content" = $3)',
  sqlite: 'UPDATE "post" SET "content" = $1, "userId" = $2 WHERE ("post"."content" = $3)',
  mysql : 'UPDATE `post` SET `content` = ?, `userId` = ? WHERE (`post`.`content` = ?)',
  params: ['test', 3, 'no']
});

Harness.test({
  query : post.update({content: user.name}).from(user).where(post.userId.equals(user.id)),
  sqlite: 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")',
  pg    : 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")',
  mysql : 'UPDATE `post` SET `content` = `user`.`name` FROM `user` WHERE (`post`.`userId` = `user`.`id`)',
  params: []
});

// update() needs to prefix ambiguous source columns; prefixing target columns is not allowed
Harness.test({
  query : post.update({userId: user.id}).from(user).where(post.userId.equals(user.id)),
  pg    : 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")',
  sqlite: 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")',
  mysql : 'UPDATE `post` SET `userId` = `user`.`id` FROM `user` WHERE (`post`.`userId` = `user`.`id`)',
  params: []
});
