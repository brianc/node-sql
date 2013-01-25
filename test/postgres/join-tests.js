var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();
var comment = Harness.defineCommentTable();

Harness.test({
  query : user.select(user.name, post.content).from(user.join(post).on(user.id.equals(post.userId))),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")'
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
          ' INNER JOIN "comment" ON ("post"."id" = "comment"."postId")'
});

Harness.test({
  query : user.select(user.name, post.content).from(user.leftJoin(post).on(user.id.equals(post.userId))),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" LEFT JOIN "post" ON ("user"."id" = "post"."userId")'
});

Harness.test({
  query : user
    .select(user.name, post.content)
    .from(user.join(
      post
        .subQuery('subposts')
        .select(post.content, post.userId)
        .from(post))
    .on(user.id.equals(post.userId))),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN (SELECT "post"."content", "post"."userId" FROM "post") subposts ON ("user"."id" = "post"."userId")'
});
