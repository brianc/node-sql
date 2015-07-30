'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.where(user.id.isNotNull(), user.name.isNotNull()),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))',
    string: 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  params: []
});

Harness.test({
  query: user.and(user.id.isNotNull(), user.name.isNotNull()),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))',
    string: 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  params: []
});

Harness.test({
  query: user.where([user.id.isNotNull(), user.name.isNotNull()]),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))',
    string: 'SELECT * FROM [user] WHERE (([user].[id] IS NOT NULL) AND ([user].[name] IS NOT NULL))'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  params: []
});

Harness.test({
  query: user.where([]),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (1 = 1)',
    string: 'SELECT * FROM "user" WHERE (1 = 1)'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE (1 = 1)',
    string: 'SELECT * FROM `user` WHERE (1 = 1)'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (1 = 1)',
    string: 'SELECT * FROM "user" WHERE (1 = 1)'
  },
  mssql: {
    text  : 'SELECT * FROM [user] WHERE (1 = 1)',
    string: 'SELECT * FROM [user] WHERE (1 = 1)'
  },
  oracle: {
    text  : 'SELECT * FROM "user" WHERE (1 = 1)',
    string: 'SELECT * FROM "user" WHERE (1 = 1)'
  },
  params: []
});

Harness.test({
  query: user.select().where(user.id.equals(1)).and(user.name.equals('a')),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = $1) AND ("user"."name" = $2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) AND ("user"."name" = \'a\'))'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE ((`user`.`id` = ?) AND (`user`.`name` = ?))',
    string: 'SELECT `user`.* FROM `user` WHERE ((`user`.`id` = 1) AND (`user`.`name` = \'a\'))'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = $1) AND ("user"."name" = $2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) AND ("user"."name" = \'a\'))'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user] WHERE (([user].[id] = @1) AND ([user].[name] = @2))',
    string: 'SELECT [user].* FROM [user] WHERE (([user].[id] = 1) AND ([user].[name] = \'a\'))'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = :1) AND ("user"."name" = :2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) AND ("user"."name" = \'a\'))'
  },
  params: [1,'a']
});

Harness.test({
  query: user.select().and(user.id.equals(1)),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = $1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE (`user`.`id` = ?)',
    string: 'SELECT `user`.* FROM `user` WHERE (`user`.`id` = 1)'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = $1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user] WHERE ([user].[id] = @1)',
    string: 'SELECT [user].* FROM [user] WHERE ([user].[id] = 1)'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = :1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  params: [1]
});

Harness.test({
  query: user.select().or(user.id.equals(1)),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = $1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE (`user`.`id` = ?)',
    string: 'SELECT `user`.* FROM `user` WHERE (`user`.`id` = 1)'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = $1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user] WHERE ([user].[id] = @1)',
    string: 'SELECT [user].* FROM [user] WHERE ([user].[id] = 1)'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" = :1)',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" = 1)'
  },
  params: [1]
});

Harness.test({
  query: user.select().and(user.id.equals(1)).or(user.name.equals('a')),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) OR ("user"."name" = \'a\'))'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE ((`user`.`id` = ?) OR (`user`.`name` = ?))',
    string: 'SELECT `user`.* FROM `user` WHERE ((`user`.`id` = 1) OR (`user`.`name` = \'a\'))'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) OR ("user"."name" = \'a\'))'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user] WHERE (([user].[id] = @1) OR ([user].[name] = @2))',
    string: 'SELECT [user].* FROM [user] WHERE (([user].[id] = 1) OR ([user].[name] = \'a\'))'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE (("user"."id" = :1) OR ("user"."name" = :2))',
    string: 'SELECT "user".* FROM "user" WHERE (("user"."id" = 1) OR ("user"."name" = \'a\'))'
  },
  params: [1,'a']
});

