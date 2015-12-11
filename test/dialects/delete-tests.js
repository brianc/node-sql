'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();

Harness.test({
  query: post.delete().where(post.content.equals("hello's world")),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'hello\'\'s world\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'hello\'\'s world\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'hello\'\'s world\')'
  },
  mssql: {
    text  : 'DELETE FROM [post] WHERE ([post].[content] = @1)',
    string: "DELETE FROM [post] WHERE ([post].[content] = 'hello''s world')"
  },
  oracle: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = :1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'hello\'\'s world\')'
  },
  params: ["hello's world"]
});

Harness.test({
  query: post.delete(post).from(post),
  pg: {
    text: 'DELETE "post" FROM "post"',
    string: 'DELETE "post" FROM "post"'
  },
  sqlite: {
    text: 'DELETE "post" FROM "post"',
    string: 'DELETE "post" FROM "post"'
  },
  mysql: {
    text: 'DELETE `post` FROM `post`',
    string: 'DELETE `post` FROM `post`'
  },
  params: []
});

Harness.test({
  query: post.delete([post, post]).from(post),
  pg: {
    text: 'DELETE "post", "post" FROM "post"',
    string: 'DELETE "post", "post" FROM "post"'
  },
  sqlite: {
    text: 'DELETE "post", "post" FROM "post"',
    string: 'DELETE "post", "post" FROM "post"'
  },
  mysql: {
    text: 'DELETE `post`, `post` FROM `post`',
    string: 'DELETE `post`, `post` FROM `post`'
  },
  params: []
});

Harness.test({
  query: user
    .delete(user)
    .from(user.join(post).on(post.userId.equals(user.id)))
    .where(post.content.equals('foo')),
  pg: {
    text: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = $1)',
    string: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = \'foo\')'
  },
  sqlite: {
    text: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = $1)',
    string: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = \'foo\')'
  },
  mysql: {
    text: 'DELETE `user` FROM `user` INNER JOIN `post` ON (`post`.`userId` = `user`.`id`) WHERE (`post`.`content` = ?)',
    string: 'DELETE `user` FROM `user` INNER JOIN `post` ON (`post`.`userId` = `user`.`id`) WHERE (`post`.`content` = \'foo\')'
  },
  oracle: {
    text: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = :1)',
    string: 'DELETE "user" FROM "user" INNER JOIN "post" ON ("post"."userId" = "user"."id") WHERE ("post"."content" = \'foo\')'
  },
  params: [ 'foo' ]
});

Harness.test({
  query: post.delete().where({
    content: ''
  }),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'\')'
  },
  mssql: {
    text  : 'DELETE FROM [post] WHERE ([post].[content] = @1)',
    string: "DELETE FROM [post] WHERE ([post].[content] = '')"
  },
  oracle: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = :1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  params: ['']
});

Harness.test({
  query: post.delete({
    content: ''
  }),
  pg: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE (`post`.`content` = ?)',
    string: 'DELETE FROM `post` WHERE (`post`.`content` = \'\')'
  },
  mssql: {
    text  : 'DELETE FROM [post] WHERE ([post].[content] = @1)',
    string: "DELETE FROM [post] WHERE ([post].[content] = '')"
  },
  oracle: {
    text  : 'DELETE FROM "post" WHERE ("post"."content" = :1)',
    string: 'DELETE FROM "post" WHERE ("post"."content" = \'\')'
  },
  params: ['']
});

Harness.test({
  query: post.delete({
    content: ''
  }).or(post.content.isNull()),
  pg: {
    text  : 'DELETE FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
    string: 'DELETE FROM "post" WHERE (("post"."content" = \'\') OR ("post"."content" IS NULL))'
  },
  sqlite: {
    text  : 'DELETE FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
    string: 'DELETE FROM "post" WHERE (("post"."content" = \'\') OR ("post"."content" IS NULL))'
  },
  mysql: {
    text  : 'DELETE FROM `post` WHERE ((`post`.`content` = ?) OR (`post`.`content` IS NULL))',
    string: 'DELETE FROM `post` WHERE ((`post`.`content` = \'\') OR (`post`.`content` IS NULL))'
  },
  mssql: {
    text  : 'DELETE FROM [post] WHERE (([post].[content] = @1) OR ([post].[content] IS NULL))',
    string: "DELETE FROM [post] WHERE (([post].[content] = '') OR ([post].[content] IS NULL))"
  },
  oracle: {
    text  : 'DELETE FROM "post" WHERE (("post"."content" = :1) OR ("post"."content" IS NULL))',
    string: 'DELETE FROM "post" WHERE (("post"."content" = \'\') OR ("post"."content" IS NULL))'
  },
  params: ['']
});
