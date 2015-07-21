'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

// shortcut: 'select * from <table>'
Harness.test({
  query: user,
  pg: {
    text  : 'SELECT "user".* FROM "user"',
    string: 'SELECT "user".* FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user"',
    string: 'SELECT "user".* FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user`',
    string: 'SELECT `user`.* FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user]',
    string: 'SELECT [user].* FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user"',
    string: 'SELECT "user".* FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.where(user.name.equals(3)),
  pg: {
    text  : 'SELECT * FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT * FROM "user" WHERE ("user"."name" = 3)'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT * FROM "user" WHERE ("user"."name" = 3)'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE (`user`.`name` = ?)',
    string: 'SELECT * FROM `user` WHERE (`user`.`name` = 3)'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE ([user].[name] = @1)',
    string: 'SELECT * FROM [user] WHERE ([user].[name] = 3)'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE ("user"."name" = :1)',
    string: 'SELECT * FROM "user" WHERE ("user"."name" = 3)'
  },
  params: [3]
});

Harness.test({
  query: user.where(user.name.equals(3)).where(user.id.equals(1)),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
    string: 'SELECT * FROM "user" WHERE (("user"."name" = 3) AND ("user"."id" = 1))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
    string: 'SELECT * FROM "user" WHERE (("user"."name" = 3) AND ("user"."id" = 1))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`name` = ?) AND (`user`.`id` = ?))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`name` = 3) AND (`user`.`id` = 1))'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE (([user].[name] = @1) AND ([user].[id] = @2))',
    string: 'SELECT * FROM [user] WHERE (([user].[name] = 3) AND ([user].[id] = 1))'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE (("user"."name" = :1) AND ("user"."id" = :2))',
    string: 'SELECT * FROM "user" WHERE (("user"."name" = 3) AND ("user"."id" = 1))'
  },
  params: [3, 1]
});

// shortcut: no 'from'
Harness.test({
  query: post.select(post.content),
  pg: {
    text  : 'SELECT "post"."content" FROM "post"',
    string: 'SELECT "post"."content" FROM "post"'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post"',
    string: 'SELECT "post"."content" FROM "post"'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post`',
    string: 'SELECT `post`.`content` FROM `post`'
  },
  mssql: {
    text  : 'SELECT [post].[content] FROM [post]',
    string: 'SELECT [post].[content] FROM [post]'
  },
  oracle: {
    text  : 'SELECT "post"."content" FROM "post"',
    string: 'SELECT "post"."content" FROM "post"'
  },
  params: []
});

Harness.test({
  query: post.select(post.content).where(post.userId.equals(1)),
  pg: {
    text  : 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = $1)',
    string: 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = 1)'
  },
  sqlite: {
    text  : 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = $1)',
    string: 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = 1)'
  },
  mysql: {
    text  : 'SELECT `post`.`content` FROM `post` WHERE (`post`.`userId` = ?)',
    string: 'SELECT `post`.`content` FROM `post` WHERE (`post`.`userId` = 1)'
  },
  mssql: {
    text  : 'SELECT [post].[content] FROM [post] WHERE ([post].[userId] = @1)',
    string: 'SELECT [post].[content] FROM [post] WHERE ([post].[userId] = 1)'
  },
  oracle: {
    text  : 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = :1)',
    string: 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = 1)'
  },
  params: [1]
});

Harness.test({
  query: post.where(post.content.isNull()).or({
    content: ''
  }).and({
    userId: 1
  }),
  pg: {
    text  : 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = $1)) AND ("post"."userId" = $2))',
    string: 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = \'\')) AND ("post"."userId" = 1))'
  },
  sqlite: {
    text  : 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = $1)) AND ("post"."userId" = $2))',
    string: 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = \'\')) AND ("post"."userId" = 1))'
  },
  mysql: {
    text  : 'SELECT * FROM `post` WHERE (((`post`.`content` IS NULL) OR (`post`.`content` = ?)) AND (`post`.`userId` = ?))',
    string: 'SELECT * FROM `post` WHERE (((`post`.`content` IS NULL) OR (`post`.`content` = \'\')) AND (`post`.`userId` = 1))'
  },
  mssql: {
    text  : 'SELECT * FROM [post] WHERE ((([post].[content] IS NULL) OR ([post].[content] = @1)) AND ([post].[userId] = @2))',
    string: 'SELECT * FROM [post] WHERE ((([post].[content] IS NULL) OR ([post].[content] = \'\')) AND ([post].[userId] = 1))'
  },
  oracle: {
    text  : 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = :1)) AND ("post"."userId" = :2))',
    string: 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = \'\')) AND ("post"."userId" = 1))'
  },
  params: ['', 1]
});
