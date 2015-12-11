'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.select(user.id).from(user),
  pg: {
    text  : 'SELECT "user"."id" FROM "user"',
    string: 'SELECT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user"',
    string: 'SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user`',
    string: 'SELECT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user]',
    string: 'SELECT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user"',
    string: 'SELECT "user"."id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id, user.name).from(user),
  pg: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT `user`.`id`, `user`.`name` FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].[id], [user].[name] FROM [user]',
    string: 'SELECT [user].[id], [user].[name] FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.star()).from(user),
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
  query: user.select(user.id, [ user.name ]).from(user),
  pg: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text: 'SELECT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT `user`.`id`, `user`.`name` FROM `user`'
  },
  oracle: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select([ user.id ], user.name).from(user),
  pg: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text: 'SELECT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT `user`.`id`, `user`.`name` FROM `user`'
  },
  oracle: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select([ user.id , user.name ]).from(user),
  pg: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text: 'SELECT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT `user`.`id`, `user`.`name` FROM `user`'
  },
  oracle: {
    text: 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.star(), user.star({ prefix: 'foo_' }), user.star({ prefix: 'bar_' })).from(user),
  pg: {
    text: 'SELECT "user".*, "user"."id" AS "foo_id", "user"."name" AS "foo_name", "user"."id" AS "bar_id", "user"."name" AS "bar_name" FROM "user"',
    string: 'SELECT "user".*, "user"."id" AS "foo_id", "user"."name" AS "foo_name", "user"."id" AS "bar_id", "user"."name" AS "bar_name" FROM "user"'
  },
  sqlite: {
    text: 'SELECT "user".*, "user"."id" AS "foo_id", "user"."name" AS "foo_name", "user"."id" AS "bar_id", "user"."name" AS "bar_name" FROM "user"',
    string: 'SELECT "user".*, "user"."id" AS "foo_id", "user"."name" AS "foo_name", "user"."id" AS "bar_id", "user"."name" AS "bar_name" FROM "user"'
  },
  mysql: {
    text: 'SELECT `user`.*, `user`.`id` AS `foo_id`, `user`.`name` AS `foo_name`, `user`.`id` AS `bar_id`, `user`.`name` AS `bar_name` FROM `user`',
    string: 'SELECT `user`.*, `user`.`id` AS `foo_id`, `user`.`name` AS `foo_name`, `user`.`id` AS `bar_id`, `user`.`name` AS `bar_name` FROM `user`'
  },
  oracle: {
    text:   'SELECT "user".*, "user"."id" "foo_id", "user"."name" "foo_name", "user"."id" "bar_id", "user"."name" "bar_name" FROM "user"',
    string: 'SELECT "user".*, "user"."id" "foo_id", "user"."name" "foo_name", "user"."id" "bar_id", "user"."name" "bar_name" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.equals('foo')),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = \'foo\')'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = \'foo\')'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` = ?)',
    string: 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` = \'foo\')'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE ([user].[name] = @1)',
    string: 'SELECT [user].[id] FROM [user] WHERE ([user].[name] = \'foo\')'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = :1)',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = \'foo\')'
  },
  params: ['foo']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.equals('foo').or(user.name.equals('bar'))),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) OR (`user`.`name` = ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = \'foo\') OR (`user`.`name` = \'bar\'))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = @1) OR ([user].[name] = @2))',
    string: 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = \'foo\') OR ([user].[name] = \'bar\'))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = :1) OR ("user"."name" = :2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  params: ['foo', 'bar']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.equals('foo').and(user.name.equals('bar'))),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) AND ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') AND ("user"."name" = \'bar\'))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) AND ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') AND ("user"."name" = \'bar\'))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) AND (`user`.`name` = ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = \'foo\') AND (`user`.`name` = \'bar\'))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = @1) AND ([user].[name] = @2))',
    string: 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = \'foo\') AND ([user].[name] = \'bar\'))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = :1) AND ("user"."name" = :2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') AND ("user"."name" = \'bar\'))'
  },
  params: ['foo', 'bar']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('bar')),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) OR (`user`.`name` = ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = \'foo\') OR (`user`.`name` = \'bar\'))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = @1) OR ([user].[name] = @2))',
    string: 'SELECT [user].[id] FROM [user] WHERE (([user].[name] = \'foo\') OR ([user].[name] = \'bar\'))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = :1) OR ("user"."name" = :2))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = \'foo\') OR ("user"."name" = \'bar\'))'
  },
  params: ['foo', 'bar']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('baz')).and(user.name.equals('bar')),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) OR ("user"."name" = $2)) AND ("user"."name" = $3))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'foo\') OR ("user"."name" = \'baz\')) AND ("user"."name" = \'bar\'))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) OR ("user"."name" = $2)) AND ("user"."name" = $3))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'foo\') OR ("user"."name" = \'baz\')) AND ("user"."name" = \'bar\'))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = ?) OR (`user`.`name` = ?)) AND (`user`.`name` = ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = \'foo\') OR (`user`.`name` = \'baz\')) AND (`user`.`name` = \'bar\'))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE ((([user].[name] = @1) OR ([user].[name] = @2)) AND ([user].[name] = @3))',
    string: 'SELECT [user].[id] FROM [user] WHERE ((([user].[name] = \'foo\') OR ([user].[name] = \'baz\')) AND ([user].[name] = \'bar\'))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = :1) OR ("user"."name" = :2)) AND ("user"."name" = :3))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'foo\') OR ("user"."name" = \'baz\')) AND ("user"."name" = \'bar\'))'
  },
  params: ['foo', 'baz', 'bar']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.in(['foo', 'bar'])),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN ($1, $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN (\'foo\', \'bar\'))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN ($1, $2))',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN (\'foo\', \'bar\'))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` IN (?, ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` IN (\'foo\', \'bar\'))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE ([user].[name] IN (@1, @2))',
    string: 'SELECT [user].[id] FROM [user] WHERE ([user].[name] IN (\'foo\', \'bar\'))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN (:1, :2))',
    string: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN (\'foo\', \'bar\'))'
  },
  params: ['foo', 'bar']
});

Harness.test({
  query: user.select(user.id).from(user).where(user.name.in(['foo', 'bar']).and(user.id.equals(1))),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN ($1, $2)) AND ("user"."id" = $3))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN (\'foo\', \'bar\')) AND ("user"."id" = 1))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN ($1, $2)) AND ("user"."id" = $3))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN (\'foo\', \'bar\')) AND ("user"."id" = 1))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` IN (?, ?)) AND (`user`.`id` = ?))',
    string: 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` IN (\'foo\', \'bar\')) AND (`user`.`id` = 1))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE (([user].[name] IN (@1, @2)) AND ([user].[id] = @3))',
    string: 'SELECT [user].[id] FROM [user] WHERE (([user].[name] IN (\'foo\', \'bar\')) AND ([user].[id] = 1))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN (:1, :2)) AND ("user"."id" = :3))',
    string: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN (\'foo\', \'bar\')) AND ("user"."id" = 1))'
  },
  params: ['foo', 'bar', 1]
});

Harness.test({
  query: user.select(user.columns),
  pg: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.`id`, `user`.`name` FROM `user`',
    string: 'SELECT `user`.`id`, `user`.`name` FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].[id], [user].[name] FROM [user]',
    string: 'SELECT [user].[id], [user].[name] FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user"."id", "user"."name" FROM "user"',
    string: 'SELECT "user"."id", "user"."name" FROM "user"'
  },
  params: []
});


Harness.test({
  query: user
    .select(user.id)
    .from(user)
    .where(
    user.name.equals('boom')
    .and(user.id.equals(1))).or(
    user.name.equals('bang').and(user.id.equals(2))),
  pg: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) AND ("user"."id" = $2)) OR (("user"."name" = $3) AND ("user"."id" = $4)))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'boom\') AND ("user"."id" = 1)) OR (("user"."name" = \'bang\') AND ("user"."id" = 2)))'
  },
  sqlite: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) AND ("user"."id" = $2)) OR (("user"."name" = $3) AND ("user"."id" = $4)))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'boom\') AND ("user"."id" = 1)) OR (("user"."name" = \'bang\') AND ("user"."id" = 2)))'
  },
  mysql: {
    text  : 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = ?) AND (`user`.`id` = ?)) OR ((`user`.`name` = ?) AND (`user`.`id` = ?)))',
    string: 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = \'boom\') AND (`user`.`id` = 1)) OR ((`user`.`name` = \'bang\') AND (`user`.`id` = 2)))'
  },
  mssql: {
    text  : 'SELECT [user].[id] FROM [user] WHERE ((([user].[name] = @1) AND ([user].[id] = @2)) OR (([user].[name] = @3) AND ([user].[id] = @4)))',
    string: 'SELECT [user].[id] FROM [user] WHERE ((([user].[name] = \'boom\') AND ([user].[id] = 1)) OR (([user].[name] = \'bang\') AND ([user].[id] = 2)))'
  },
  oracle: {
    text  : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = :1) AND ("user"."id" = :2)) OR (("user"."name" = :3) AND ("user"."id" = :4)))',
    string: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = \'boom\') AND ("user"."id" = 1)) OR (("user"."name" = \'bang\') AND ("user"."id" = 2)))'
  },
  params: ['boom', 1, 'bang', 2]
});

Harness.test({
  query: user.select(user.name.as('user name'), user.id.as('user id')).from(user),
  pg: {
    text  : 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"',
    string: 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"',
    string: 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.`name` AS `user name`, `user`.`id` AS `user id` FROM `user`',
    string: 'SELECT `user`.`name` AS `user name`, `user`.`id` AS `user id` FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].[name] AS [user name], [user].[id] AS [user id] FROM [user]',
    string: 'SELECT [user].[name] AS [user name], [user].[id] AS [user id] FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user"."name" "user name", "user"."id" "user id" FROM "user"',
    string: 'SELECT "user"."name" "user name", "user"."id" "user id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.name.as('user name')).from(user).where(user.name.equals('brian')),
  pg: {
    text  : 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  sqlite: {
    text  : 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  mysql: {
    text  : 'SELECT `user`.`name` AS `user name` FROM `user` WHERE (`user`.`name` = ?)',
    string: 'SELECT `user`.`name` AS `user name` FROM `user` WHERE (`user`.`name` = \'brian\')'
  },
  mssql: {
    text  : 'SELECT [user].[name] AS [user name] FROM [user] WHERE ([user].[name] = @1)',
    string: 'SELECT [user].[name] AS [user name] FROM [user] WHERE ([user].[name] = \'brian\')'
  },
  oracle: {
    text  : 'SELECT "user"."name" "user name" FROM "user" WHERE ("user"."name" = :1)',
    string: 'SELECT "user"."name" "user name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  params: ['brian']
});

Harness.test({
  query: user.select(user.name).from(user).where(user.name.equals('brian')),
  pg: {
    text  : 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  sqlite: {
    text  : 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = $1)',
    string: 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  mysql: {
    text  : 'SELECT `user`.`name` FROM `user` WHERE (`user`.`name` = ?)',
    string: 'SELECT `user`.`name` FROM `user` WHERE (`user`.`name` = \'brian\')'
  },
  mssql: {
    text  : 'SELECT [user].[name] FROM [user] WHERE ([user].[name] = @1)',
    string: 'SELECT [user].[name] FROM [user] WHERE ([user].[name] = \'brian\')'
  },
  oracle: {
    text  : 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = :1)',
    string: 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = \'brian\')'
  },
  params: ['brian']
});

Harness.test({
  query: user.select('name').from('user').where('name <> NULL'),
  pg: {
    text  : 'SELECT name FROM user WHERE (name <> NULL)',
    string: 'SELECT name FROM user WHERE (name <> NULL)'
  },
  sqlite: {
    text  : 'SELECT name FROM user WHERE (name <> NULL)',
    string: 'SELECT name FROM user WHERE (name <> NULL)'
  },
  mysql: {
    text  : 'SELECT name FROM user WHERE (name <> NULL)',
    string: 'SELECT name FROM user WHERE (name <> NULL)'
  },
  mssql: {
    text  : 'SELECT name FROM user WHERE (name <> NULL)',
    string: 'SELECT name FROM user WHERE (name <> NULL)'
  },
  oracle: {
    text  : 'SELECT name FROM user WHERE (name <> NULL)',
    string: 'SELECT name FROM user WHERE (name <> NULL)'
  },
  params: []
});

Harness.test({
  query: user.select('name,id').from('user').where('name <> NULL'),
  pg: {
    text  : 'SELECT name,id FROM user WHERE (name <> NULL)',
    string: 'SELECT name,id FROM user WHERE (name <> NULL)'
  },
  sqlite: {
    text  : 'SELECT name,id FROM user WHERE (name <> NULL)',
    string: 'SELECT name,id FROM user WHERE (name <> NULL)'
  },
  mysql: {
    text  : 'SELECT name,id FROM user WHERE (name <> NULL)',
    string: 'SELECT name,id FROM user WHERE (name <> NULL)'
  },
  mssql: {
    text  : 'SELECT name,id FROM user WHERE (name <> NULL)',
    string: 'SELECT name,id FROM user WHERE (name <> NULL)'
  },
  oracle: {
    text  : 'SELECT name,id FROM user WHERE (name <> NULL)',
    string: 'SELECT name,id FROM user WHERE (name <> NULL)'
  },
  params: []
});

Harness.test({
  query: user.select('name', 'id').from('user').where('name <> NULL'),
  pg: {
    text  : 'SELECT name, id FROM user WHERE (name <> NULL)',
    string: 'SELECT name, id FROM user WHERE (name <> NULL)'
  },
  sqlite: {
    text  : 'SELECT name, id FROM user WHERE (name <> NULL)',
    string: 'SELECT name, id FROM user WHERE (name <> NULL)'
  },
  mysql: {
    text  : 'SELECT name, id FROM user WHERE (name <> NULL)',
    string: 'SELECT name, id FROM user WHERE (name <> NULL)'
  },
  mssql: {
    text  : 'SELECT name, id FROM user WHERE (name <> NULL)',
    string: 'SELECT name, id FROM user WHERE (name <> NULL)'
  },
  oracle: {
    text  : 'SELECT name, id FROM user WHERE (name <> NULL)',
    string: 'SELECT name, id FROM user WHERE (name <> NULL)'
  },
  params: []
});

Harness.test({
  query: user.select('name', 'id').from('user').where('name <> NULL').and('id <> NULL'),
  pg: {
    text  : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
    string: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))'
  },
  sqlite: {
    text  : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
    string: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))'
  },
  mysql: {
    text  : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
    string: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))'
  },
  mssql: {
    text  : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
    string: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))'
  },
  oracle: {
    text  : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
    string: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))'
  },
  params: []
});

Harness.test({
  query: user.select('name').from('user').where({
    name: 'brian'
  }),
  pg: {
    text  : 'SELECT name FROM user WHERE ("user"."name" = $1)',
    string: 'SELECT name FROM user WHERE ("user"."name" = \'brian\')'
  },
  sqlite: {
    text  : 'SELECT name FROM user WHERE ("user"."name" = $1)',
    string: 'SELECT name FROM user WHERE ("user"."name" = \'brian\')'
  },
  mysql: {
    text  : 'SELECT name FROM user WHERE (`user`.`name` = ?)',
    string: 'SELECT name FROM user WHERE (`user`.`name` = \'brian\')'
  },
  mssql: {
    text  : 'SELECT name FROM user WHERE ([user].[name] = @1)',
    string: 'SELECT name FROM user WHERE ([user].[name] = \'brian\')'
  },
  oracle: {
    text  : 'SELECT name FROM user WHERE ("user"."name" = :1)',
    string: 'SELECT name FROM user WHERE ("user"."name" = \'brian\')'
  },
  params: ['brian']
});

Harness.test({
  query: user.select('name').from('user').where({
    name: 'brian',
    id: 1
  }),
  pg: {
    text  : 'SELECT name FROM user WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
    string: 'SELECT name FROM user WHERE (("user"."name" = \'brian\') AND ("user"."id" = 1))'
  },
  sqlite: {
    text  : 'SELECT name FROM user WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
    string: 'SELECT name FROM user WHERE (("user"."name" = \'brian\') AND ("user"."id" = 1))'
  },
  mysql: {
    text  : 'SELECT name FROM user WHERE ((`user`.`name` = ?) AND (`user`.`id` = ?))',
    string: 'SELECT name FROM user WHERE ((`user`.`name` = \'brian\') AND (`user`.`id` = 1))'
  },
  mssql: {
    text  : 'SELECT name FROM user WHERE (([user].[name] = @1) AND ([user].[id] = @2))',
    string: 'SELECT name FROM user WHERE (([user].[name] = \'brian\') AND ([user].[id] = 1))'
  },
  oracle: {
    text  : 'SELECT name FROM user WHERE (("user"."name" = :1) AND ("user"."id" = :2))',
    string: 'SELECT name FROM user WHERE (("user"."name" = \'brian\') AND ("user"."id" = 1))'
  },
  params: ['brian', 1]
});

Harness.test({
  query: user.select(user.name.as('quote"quote"tick`tick`')),
  pg: {
    text  : 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"',
    string: 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"',
    string: 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"'
  },
  mysql: {
    text  : 'SELECT `user`.`name` AS `quote"quote"tick``tick``` FROM `user`',
    string: 'SELECT `user`.`name` AS `quote"quote"tick``tick``` FROM `user`'
  },
  mssql: {
    text  : 'SELECT [user].[name] AS [quote"quote"tick`tick`] FROM [user]',
    string: 'SELECT [user].[name] AS [quote"quote"tick`tick`] FROM [user]'
  },
  oracle: {
    text  : 'SELECT "user"."name" "quote""quote""tick`tick`" FROM "user"',
    string: 'SELECT "user"."name" "quote""quote""tick`tick`" FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.star()).where(user.id.in(user.subQuery().select(user.id))),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE (`user`.`id` IN (SELECT `user`.`id` FROM `user`))',
    string: 'SELECT `user`.* FROM `user` WHERE (`user`.`id` IN (SELECT `user`.`id` FROM `user`))'
  },
  mssql: {
    text  : 'SELECT [user].* FROM [user] WHERE ([user].[id] IN (SELECT [user].[id] FROM [user]))',
    string: 'SELECT [user].* FROM [user] WHERE ([user].[id] IN (SELECT [user].[id] FROM [user]))'
  },
  oracle: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))'
  },
  params: []
});
