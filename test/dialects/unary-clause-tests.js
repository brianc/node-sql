'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query : customer.select().where(customer.age.isNotNull()),
  pg    : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)',
  sqlite: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)',
  mysql : 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` IS NOT NULL)',
  params: []
});

Harness.test({
  query : post.select().where(post.userId.in(customer.subQuery().select(customer.id).where(customer.age.isNull()))),
  pg    : 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))',
  sqlite: 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))',
  mysql : 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer` WHERE (`customer`.`age` IS NULL)))',
  params: []
});
