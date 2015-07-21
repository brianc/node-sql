'use strict';

var Harness = require('./support');
var Table = require('../../lib/table');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

var u = user.as('u');
Harness.test({
  query: u.select(u.name).from(u),
  pg: {
    text  : 'SELECT "u"."name" FROM "user" AS "u"',
    string: 'SELECT "u"."name" FROM "user" AS "u"'
  },
  sqlite: {
    text  : 'SELECT "u"."name" FROM "user" AS "u"',
    string: 'SELECT "u"."name" FROM "user" AS "u"'
  },
  mysql: {
    text  : 'SELECT `u`.`name` FROM `user` AS `u`',
    string: 'SELECT `u`.`name` FROM `user` AS `u`'
  },
  mssql: {
    text  : 'SELECT [u].[name] FROM [user] AS [u]',
    string: 'SELECT [u].[name] FROM [user] AS [u]'
  },
  oracle: {
    text  : 'SELECT "u"."name" FROM "user" "u"',
    string: 'SELECT "u"."name" FROM "user" "u"'
  },
  params: []
});

Harness.test({
  query: u.select(u.star()).from(u),
  pg: {
    text  : 'SELECT "u".* FROM "user" AS "u"',
    string: 'SELECT "u".* FROM "user" AS "u"'
  },
  sqlite: {
    text  : 'SELECT "u".* FROM "user" AS "u"',
    string: 'SELECT "u".* FROM "user" AS "u"'
  },
  mysql: {
    text  : 'SELECT `u`.* FROM `user` AS `u`',
    string: 'SELECT `u`.* FROM `user` AS `u`'
  },
  mssql: {
    text  : 'SELECT [u].* FROM [user] AS [u]',
    string: 'SELECT [u].* FROM [user] AS [u]'
  },
  oracle: {
    text  : 'SELECT "u".* FROM "user" "u"',
    string: 'SELECT "u".* FROM "user" "u"'
  },
  params: []
});

var p = post.as('p');
Harness.test({
  query: u.select(u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.id.equals(3)))),
  pg: {
    text  : 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = $1))',
    string: 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = 3))'
  },
  sqlite: {
    text  : 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = $1))',
    string: 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = 3))'
  },
  mysql: {
    text  : 'SELECT `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`id` = ?))',
    string: 'SELECT `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`id` = 3))'
  },
  mssql: {
    text  : 'SELECT [u].[name] FROM [user] AS [u] INNER JOIN [post] AS [p] ON (([u].[id] = [p].[userId]) AND ([p].[id] = @1))',
    string: 'SELECT [u].[name] FROM [user] AS [u] INNER JOIN [post] AS [p] ON (([u].[id] = [p].[userId]) AND ([p].[id] = 3))'
  },
  oracle: {
    text  : 'SELECT "u"."name" FROM "user" "u" INNER JOIN "post" "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = :1))',
    string: 'SELECT "u"."name" FROM "user" "u" INNER JOIN "post" "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = 3))'
  },
  params: [3]
});

Harness.test({
  query: u.select(p.content, u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.content.isNotNull()))),
  pg: {
    text  : 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))',
    string: 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))',
    string: 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT `p`.`content`, `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`content` IS NOT NULL))',
    string: 'SELECT `p`.`content`, `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`content` IS NOT NULL))'
  },
  mssql: {
    text  : 'SELECT [p].[content], [u].[name] FROM [user] AS [u] INNER JOIN [post] AS [p] ON (([u].[id] = [p].[userId]) AND ([p].[content] IS NOT NULL))',
    string: 'SELECT [p].[content], [u].[name] FROM [user] AS [u] INNER JOIN [post] AS [p] ON (([u].[id] = [p].[userId]) AND ([p].[content] IS NOT NULL))'
  },
  oracle: {
    text  : 'SELECT "p"."content", "u"."name" FROM "user" "u" INNER JOIN "post" "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))',
    string: 'SELECT "p"."content", "u"."name" FROM "user" "u" INNER JOIN "post" "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))'
  },
  params: []
});

// the quote property isn't implemented for columns, so all columns are quoted in generated queries
var comment = Table.define({
  name: 'comment',
  columns: [{
      name: 'text',
      quote: true
    }, {
      name: 'userId',
      quote: false
    }
  ]
});

Harness.test({
  query: comment.select(comment.text, comment.userId),
  pg: {
    text  : 'SELECT "comment"."text", "comment"."userId" FROM "comment"',
    string: 'SELECT "comment"."text", "comment"."userId" FROM "comment"'
  },
  sqlite: {
    text  : 'SELECT "comment"."text", "comment"."userId" FROM "comment"',
    string: 'SELECT "comment"."text", "comment"."userId" FROM "comment"'
  },
  mysql: {
    text  : 'SELECT `comment`.`text`, `comment`.`userId` FROM `comment`',
    string: 'SELECT `comment`.`text`, `comment`.`userId` FROM `comment`'
  },
  mssql: {
    text  : 'SELECT [comment].[text], [comment].[userId] FROM [comment]',
    string: 'SELECT [comment].[text], [comment].[userId] FROM [comment]'
  },
  orcle: {
    text  : 'SELECT "comment"."text", "comment"."userId" FROM "comment"',
    string: 'SELECT "comment"."text", "comment"."userId" FROM "comment"'
  },
  params: []
});
