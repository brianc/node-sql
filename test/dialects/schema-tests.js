'use strict';

var Harness = require('./support');
var Table = require(__dirname + '/../../lib/table');

var userWithSchema = Table.define({
  schema: 'staging',
  name: 'user',
  quote: true,
  columns: ['id', 'name']
});

Harness.test({
  query: userWithSchema.select(userWithSchema.id).from(userWithSchema),
  pg: {
    text  : 'SELECT "staging"."user"."id" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id" FROM "staging"."user"'
  },
  sqlite: {
    text  : 'SELECT "staging"."user"."id" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id" FROM "staging"."user"'
  },
  mysql: {
    text  : 'SELECT `staging`.`user`.`id` FROM `staging`.`user`',
    string: 'SELECT `staging`.`user`.`id` FROM `staging`.`user`'
  },
  mssql: {
    text  : 'SELECT [staging].[user].[id] FROM [staging].[user]',
    string: 'SELECT [staging].[user].[id] FROM [staging].[user]'
  },
  oracle: {
    text  : 'SELECT "staging"."user"."id" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id" FROM "staging"."user"'
  },
  params: []
});

Harness.test({
  query: userWithSchema.select(userWithSchema.id.count()).from(userWithSchema),
  pg: {
    text  : 'SELECT COUNT("staging"."user"."id") AS "id_count" FROM "staging"."user"',
    string: 'SELECT COUNT("staging"."user"."id") AS "id_count" FROM "staging"."user"'
  },
  sqlite: {
    text  : 'SELECT COUNT("staging"."user"."id") AS "id_count" FROM "staging"."user"',
    string: 'SELECT COUNT("staging"."user"."id") AS "id_count" FROM "staging"."user"'
  },
  mysql: {
    text  : 'SELECT COUNT(`staging`.`user`.`id`) AS `id_count` FROM `staging`.`user`',
    string: 'SELECT COUNT(`staging`.`user`.`id`) AS `id_count` FROM `staging`.`user`'
  },
  mssql: {
    text  : 'SELECT COUNT([staging].[user].[id]) AS [id_count] FROM [staging].[user]',
    string: 'SELECT COUNT([staging].[user].[id]) AS [id_count] FROM [staging].[user]'
  },
  oracle: {
    text  : 'SELECT COUNT("staging"."user"."id") "id_count" FROM "staging"."user"',
    string: 'SELECT COUNT("staging"."user"."id") "id_count" FROM "staging"."user"'
  },
  params: []
});

Harness.test({
  query: userWithSchema.select(userWithSchema.id, userWithSchema.name).from(userWithSchema),
  pg: {
    text  : 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"'
  },
  sqlite: {
    text  : 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"'
  },
  mysql: {
    text  : 'SELECT `staging`.`user`.`id`, `staging`.`user`.`name` FROM `staging`.`user`',
    string: 'SELECT `staging`.`user`.`id`, `staging`.`user`.`name` FROM `staging`.`user`'
  },
  mssql: {
    text  : 'SELECT [staging].[user].[id], [staging].[user].[name] FROM [staging].[user]',
    string: 'SELECT [staging].[user].[id], [staging].[user].[name] FROM [staging].[user]'
  },
  oracle: {
    text  : 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"',
    string: 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"'
  },
  params: []
});

var uws = userWithSchema.as('uws');
Harness.test({
  query: uws.select(uws.name).from(uws),
  pg: {
    text  : 'SELECT "uws"."name" FROM "staging"."user" AS "uws"',
    string: 'SELECT "uws"."name" FROM "staging"."user" AS "uws"'
  },
  sqlite: {
    text  : 'SELECT "uws"."name" FROM "staging"."user" AS "uws"',
    string: 'SELECT "uws"."name" FROM "staging"."user" AS "uws"'
  },
  mysql: {
    text  : 'SELECT `uws`.`name` FROM `staging`.`user` AS `uws`',
    string: 'SELECT `uws`.`name` FROM `staging`.`user` AS `uws`'
  },
  mssql: {
    text  : 'SELECT [uws].[name] FROM [staging].[user] AS [uws]',
    string: 'SELECT [uws].[name] FROM [staging].[user] AS [uws]'
  },
  oracle: {
    text  : 'SELECT "uws"."name" FROM "staging"."user" "uws"',
    string: 'SELECT "uws"."name" FROM "staging"."user" "uws"'
  },
  params: []
});

var postWithSchema = Table.define({
  schema: 'dev',
  name: 'post',
  columns: ['id', 'userId', 'content']
});

Harness.test({
  query: userWithSchema.select(userWithSchema.name, postWithSchema.content).from(userWithSchema.join(postWithSchema).on(userWithSchema.id.equals(postWithSchema.userId))),
  pg: {
    text  : 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")',
    string: 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")'
  },
  sqlite: {
    text  : 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")',
    string: 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")'
  },
  mysql: {
    text  : 'SELECT `staging`.`user`.`name`, `dev`.`post`.`content` FROM `staging`.`user` INNER JOIN `dev`.`post` ON (`staging`.`user`.`id` = `dev`.`post`.`userId`)',
    string: 'SELECT `staging`.`user`.`name`, `dev`.`post`.`content` FROM `staging`.`user` INNER JOIN `dev`.`post` ON (`staging`.`user`.`id` = `dev`.`post`.`userId`)'
  },
  mssql: {
    text  : 'SELECT [staging].[user].[name], [dev].[post].[content] FROM [staging].[user] INNER JOIN [dev].[post] ON ([staging].[user].[id] = [dev].[post].[userId])',
    string: 'SELECT [staging].[user].[name], [dev].[post].[content] FROM [staging].[user] INNER JOIN [dev].[post] ON ([staging].[user].[id] = [dev].[post].[userId])'
  },
  oracle: {
    text  : 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")',
    string: 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")'
  },
  params: []
});

Harness.test({
  query: uws.select(uws.name, postWithSchema.content).from(uws.join(postWithSchema).on(uws.id.equals(postWithSchema.userId))),
  pg: {
    text  : 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")',
    string: 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")'
  },
  sqlite: {
    text  : 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")',
    string: 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")'
  },
  mysql: {
    text  : 'SELECT `uws`.`name`, `dev`.`post`.`content` FROM `staging`.`user` AS `uws` INNER JOIN `dev`.`post` ON (`uws`.`id` = `dev`.`post`.`userId`)',
    string: 'SELECT `uws`.`name`, `dev`.`post`.`content` FROM `staging`.`user` AS `uws` INNER JOIN `dev`.`post` ON (`uws`.`id` = `dev`.`post`.`userId`)'
  },
  mssql: {
    text  : 'SELECT [uws].[name], [dev].[post].[content] FROM [staging].[user] AS [uws] INNER JOIN [dev].[post] ON ([uws].[id] = [dev].[post].[userId])',
    string: 'SELECT [uws].[name], [dev].[post].[content] FROM [staging].[user] AS [uws] INNER JOIN [dev].[post] ON ([uws].[id] = [dev].[post].[userId])'
  },
  oracle: {
    text  : 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")',
    string: 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")'
  },
  params: []
});
