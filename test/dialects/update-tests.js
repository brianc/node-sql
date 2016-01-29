'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();
var variable = Harness.defineVariableTable();

Harness.test({
  query: post.update({
    content: 'test'
  }),
  pg: {
    text  : 'UPDATE "post" SET "content" = $1',
    string: 'UPDATE "post" SET "content" = \'test\''
  },
  sqlite: {
    text  : 'UPDATE "post" SET "content" = $1',
    string: 'UPDATE "post" SET "content" = \'test\''
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = ?',
    string: 'UPDATE `post` SET `content` = \'test\''
  },
  mssql: {
    text  : 'UPDATE [post] SET [content] = @1',
    string: 'UPDATE [post] SET [content] = \'test\''
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = :1',
    string: 'UPDATE "post" SET "content" = \'test\''
  },
  params: ['test']
});

Harness.test({
  query: post.update({
    content: 'test',
    userId: 3
  }),
  pg: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3'
  },
  sqlite: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3'
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = ?, `userId` = ?',
    string: 'UPDATE `post` SET `content` = \'test\', `userId` = 3'
  },
  mssql: {
    text  : 'UPDATE [post] SET [content] = @1, [userId] = @2',
    string: 'UPDATE [post] SET [content] = \'test\', [userId] = 3'
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = :1, "userId" = :2',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3'
  },
  params: ['test', 3]
});

Harness.test({
  query: post.update({
    content: null,
    userId: 3
  }),
  pg: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2',
    string: 'UPDATE "post" SET "content" = NULL, "userId" = 3'
  },
  sqlite: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2',
    string: 'UPDATE "post" SET "content" = NULL, "userId" = 3'
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = ?, `userId` = ?',
    string: 'UPDATE `post` SET `content` = NULL, `userId` = 3'
  },
  mssql: {
    text  : 'UPDATE [post] SET [content] = @1, [userId] = @2',
    string: 'UPDATE [post] SET [content] = NULL, [userId] = 3'
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = :1, "userId" = :2',
    string: 'UPDATE "post" SET "content" = NULL, "userId" = 3'
  },
  params: [null, 3]
});

Harness.test({
  query: post.update({
    content: 'test',
    userId: 3
  }).where(post.content.equals('no')),
  pg: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2 WHERE ("post"."content" = $3)',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3 WHERE ("post"."content" = \'no\')'
  },
  sqlite: {
    text  : 'UPDATE "post" SET "content" = $1, "userId" = $2 WHERE ("post"."content" = $3)',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3 WHERE ("post"."content" = \'no\')'
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = ?, `userId` = ? WHERE (`post`.`content` = ?)',
    string: 'UPDATE `post` SET `content` = \'test\', `userId` = 3 WHERE (`post`.`content` = \'no\')'
  },
  mssql: {
    text  : 'UPDATE [post] SET [content] = @1, [userId] = @2 WHERE ([post].[content] = @3)',
    string: 'UPDATE [post] SET [content] = \'test\', [userId] = 3 WHERE ([post].[content] = \'no\')'
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = :1, "userId" = :2 WHERE ("post"."content" = :3)',
    string: 'UPDATE "post" SET "content" = \'test\', "userId" = 3 WHERE ("post"."content" = \'no\')'
  },
  params: ['test', 3, 'no']
});

Harness.test({
  query: post.update({
    content: user.name
  }).from(user).where(post.userId.equals(user.id)),
  sqlite: {
    text  : 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  pg: {
    text  : 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = `user`.`name` FROM `user` WHERE (`post`.`userId` = `user`.`id`)',
    string: 'UPDATE `post` SET `content` = `user`.`name` FROM `user` WHERE (`post`.`userId` = `user`.`id`)'
  },
  mssql: {
    text  : 'UPDATE [post] SET [content] = [user].[name] FROM [user] WHERE ([post].[userId] = [user].[id])',
    string: 'UPDATE [post] SET [content] = [user].[name] FROM [user] WHERE ([post].[userId] = [user].[id])'
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "content" = "user"."name" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  params: []
});

// update() needs to prefix ambiguous source columns; prefixing target columns is not allowed
Harness.test({
  query: post.update({
    userId: user.id
  }).from(user).where(post.userId.equals(user.id)),
  pg: {
    text  : 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  sqlite: {
    text  : 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  mysql: {
    text  : 'UPDATE `post` SET `userId` = `user`.`id` FROM `user` WHERE (`post`.`userId` = `user`.`id`)',
    string: 'UPDATE `post` SET `userId` = `user`.`id` FROM `user` WHERE (`post`.`userId` = `user`.`id`)'
  },
  mssql: {
    text  : 'UPDATE [post] SET [userId] = [user].[id] FROM [user] WHERE ([post].[userId] = [user].[id])',
    string: 'UPDATE [post] SET [userId] = [user].[id] FROM [user] WHERE ([post].[userId] = [user].[id])'
  },
  oracle: {
    text  : 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")',
    string: 'UPDATE "post" SET "userId" = "user"."id" FROM "user" WHERE ("post"."userId" = "user"."id")'
  },
  params: []
});

// Binary updates
Harness.test({
  query: post.update({
    content: new Buffer('test')
  }),
  pg: {
    text  : 'UPDATE "post" SET "content" = $1',
    string: 'UPDATE "post" SET "content" = \'\\x74657374\''
  },
  sqlite: {
    text  : 'UPDATE "post" SET "content" = $1',
    string: 'UPDATE "post" SET "content" = x\'74657374\''
  },
  mysql: {
    text  : 'UPDATE `post` SET `content` = ?',
    string: 'UPDATE `post` SET `content` = x\'74657374\''
  },
  oracle: {
    text  : 'UPDATE "post" SET "content" = :1',
    string: 'UPDATE "post" SET "content" = utl_raw.cast_to_varchar2(hextoraw(\'74657374\'))'
  },
  params: [new Buffer('test')]
});

// Boolean updates
Harness.test({
  query: variable.update({
    a: true,
    b: false
  }),
  pg: {
    text  : 'UPDATE "variable" SET "a" = $1, "b" = $2',
    string: 'UPDATE "variable" SET "a" = TRUE, "b" = FALSE'
  },
  sqlite: {
    text  : 'UPDATE "variable" SET "a" = $1, "b" = $2',
    string: 'UPDATE "variable" SET "a" = 1, "b" = 0'
  },
  mysql: {
    text  : 'UPDATE `variable` SET `a` = ?, `b` = ?',
    string: 'UPDATE `variable` SET `a` = TRUE, `b` = FALSE'
  },
  oracle: {
    text  : 'UPDATE "variable" SET "a" = :1, "b" = :2',
    string: 'UPDATE "variable" SET "a" = TRUE, "b" = FALSE'
  },
  params: [true, false]
});

// Object updates
Harness.test({
  query: variable.update({
    a: {"id": 1, "value": 2},
    b: [{"id": 2, "value": 3}, {"id": 3, "value": 4}]
  }),
  pg: {
    text  : 'UPDATE "variable" SET "a" = $1, "b" = $2',
    string: 'UPDATE "variable" SET "a" = \'{"id":1,"value":2}\', "b" = \'[{"id":2,"value":3},{"id":3,"value":4}]\''
  },
  sqlite: {
    text  : 'UPDATE "variable" SET "a" = $1, "b" = $2',
    string: 'UPDATE "variable" SET "a" = \'{"id":1,"value":2}\', "b" = \'[{"id":2,"value":3},{"id":3,"value":4}]\''
  },
  mysql: {
    text  : 'UPDATE `variable` SET `a` = ?, `b` = ?',
    string: 'UPDATE `variable` SET `a` = \'{"id":1,"value":2}\', `b` = (\'{"id":2,"value":3}\', \'{"id":3,"value":4}\')'
  },
  oracle: {
    text  : 'UPDATE "variable" SET "a" = :1, "b" = :2',
    string: 'UPDATE "variable" SET "a" = \'{"id":1,"value":2}\', "b" = (\'{"id":2,"value":3}\', \'{"id":3,"value":4}\')'
  },
  params: [{"id": 1, "value": 2}, [{"id": 2, "value": 3}, {"id": 3, "value": 4}]]
});