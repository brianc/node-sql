'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();
var comment = Harness.defineCommentTable();

Harness.test({
  query : user.select(user.name, post.content).from(user.join(post).on(user.id.equals(post.userId))),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  sqlite: 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  mysql : 'SELECT `user`.`name`, `post`.`content` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`)'
});

Harness.test({
  query : user.join(post).on(user.id.equals(post.userId)),
  pg    : '"user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  sqlite: '"user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  mysql : '`user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`)'
});

Harness.test({
  query : user
            .select(user.name, post.content, comment.text)
            .from(
              user
                .join(post).on(user.id.equals(post.userId))
                .join(comment).on(post.id.equals(comment.postId))
            ),
  pg    : 'SELECT "user"."name", "post"."content", "comment"."text" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")' +
          ' INNER JOIN "comment" ON ("post"."id" = "comment"."postId")',
  sqlite: 'SELECT "user"."name", "post"."content", "comment"."text" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")' +
          ' INNER JOIN "comment" ON ("post"."id" = "comment"."postId")',
  mysql : 'SELECT `user`.`name`, `post`.`content`, `comment`.`text` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`)' +
          ' INNER JOIN `comment` ON (`post`.`id` = `comment`.`postId`)'
});

Harness.test({
  query : user.select(user.name, post.content).from(user.leftJoin(post).on(user.id.equals(post.userId))),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" LEFT JOIN "post" ON ("user"."id" = "post"."userId")',
  sqlite: 'SELECT "user"."name", "post"."content" FROM "user" LEFT JOIN "post" ON ("user"."id" = "post"."userId")',
  mysql : 'SELECT `user`.`name`, `post`.`content` FROM `user` LEFT JOIN `post` ON (`user`.`id` = `post`.`userId`)'
});

Harness.test({
  query : user
            .select(user.name, post.content)
            .from(
              user
                .leftJoin(post).on(user.id.equals(post.userId))
                .leftJoin(comment).on(post.id.equals(comment.postId))
            ),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" LEFT JOIN "post" ON ("user"."id" = "post"."userId")' +
          ' LEFT JOIN "comment" ON ("post"."id" = "comment"."postId")',
  sqlite: 'SELECT "user"."name", "post"."content" FROM "user" LEFT JOIN "post" ON ("user"."id" = "post"."userId")' +
          ' LEFT JOIN "comment" ON ("post"."id" = "comment"."postId")',
  mysql : 'SELECT `user`.`name`, `post`.`content` FROM `user` LEFT JOIN `post` ON (`user`.`id` = `post`.`userId`)' +
          ' LEFT JOIN `comment` ON (`post`.`id` = `comment`.`postId`)'
});

var subposts = post
  .subQuery('subposts')
  .select(
    post.content,
    post.userId.as('subpostUserId'))
  .from(post);

Harness.test({
  query : user
    .select(user.name, subposts.content)
    .from(user.join(subposts)
    .on(user.id.equals(subposts.subpostUserId))),
  pg    : 'SELECT "user"."name", "subposts"."content" FROM "user" INNER JOIN (SELECT "post"."content", "post"."userId" AS "subpostUserId" FROM "post") subposts ON ("user"."id" = "subposts"."subpostUserId")',
  sqlite: 'SELECT "user"."name", "subposts"."content" FROM "user" INNER JOIN (SELECT "post"."content", "post"."userId" AS "subpostUserId" FROM "post") subposts ON ("user"."id" = "subposts"."subpostUserId")',
  mysql : 'SELECT `user`.`name`, `subposts`.`content` FROM `user` INNER JOIN (SELECT `post`.`content`, `post`.`userId` AS `subpostUserId` FROM `post`) subposts ON (`user`.`id` = `subposts`.`subpostUserId`)'
});
