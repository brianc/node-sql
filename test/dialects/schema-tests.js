'use strict';

var Harness = require('./support');
var Table = require(__dirname + '/../../lib/table');

var userWithSchema = Table.define({
  schema: 'staging',
  name: 'user',
  quote: true,
  columns: ['id','name']
});

Harness.test({
  query : userWithSchema.select(userWithSchema.id).from(userWithSchema),
  pg    : 'SELECT "staging"."user"."id" FROM "staging"."user"',
  sqlite: 'SELECT "staging"."user"."id" FROM "staging"."user"',
  mysql : 'SELECT `staging`.`user`.`id` FROM `staging`.`user`'
});

Harness.test({
  query : userWithSchema.select(userWithSchema.id, userWithSchema.name).from(userWithSchema),
  pg    : 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"',
  sqlite: 'SELECT "staging"."user"."id", "staging"."user"."name" FROM "staging"."user"',
  mysql : 'SELECT `staging`.`user`.`id`, `staging`.`user`.`name` FROM `staging`.`user`'
});

var uws = userWithSchema.as('uws');
Harness.test({
  query : uws.select(uws.name).from(uws),
  pg    :'SELECT "uws"."name" FROM "staging"."user" AS "uws"',
  sqlite:'SELECT "uws"."name" FROM "staging"."user" AS "uws"',
  mysql :'SELECT `uws`.`name` FROM `staging`.`user` AS `uws`'
});

var postWithSchema = Table.define({
  schema: 'dev',
  name: 'post',
  columns: ['id', 'userId', 'content']
});

Harness.test({
  query : userWithSchema.select(userWithSchema.name, postWithSchema.content).from(userWithSchema.join(postWithSchema).on(userWithSchema.id.equals(postWithSchema.userId))),
  pg    : 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")',
  sqlite: 'SELECT "staging"."user"."name", "dev"."post"."content" FROM "staging"."user" INNER JOIN "dev"."post" ON ("staging"."user"."id" = "dev"."post"."userId")',
  mysql : 'SELECT `staging`.`user`.`name`, `dev`.`post`.`content` FROM `staging`.`user` INNER JOIN `dev`.`post` ON (`staging`.`user`.`id` = `dev`.`post`.`userId`)'
});

Harness.test({
  query : uws.select(uws.name, postWithSchema.content).from(uws.join(postWithSchema).on(uws.id.equals(postWithSchema.userId))),
  pg    : 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")',
  sqlite: 'SELECT "uws"."name", "dev"."post"."content" FROM "staging"."user" AS "uws" INNER JOIN "dev"."post" ON ("uws"."id" = "dev"."post"."userId")',
  mysql : 'SELECT `uws`.`name`, `dev`.`post`.`content` FROM `staging`.`user` AS `uws` INNER JOIN `dev`.`post` ON (`uws`.`id` = `dev`.`post`.`userId`)'
});
