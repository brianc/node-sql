'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query : customer.select().where(customer.age.between(18, 25)),
  pg    : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN $1 AND $2)',
  sqlite: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN $1 AND $2)',
  mysql : 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` BETWEEN ? AND ?)',
  params: [18, 25]
});

Harness.test({
  query : post.select().where(post.userId.between(customer.subQuery().select(customer.id.min()), customer.subQuery().select(customer.id.max()))),
  pg    : 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))',
  sqlite: 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))',
  mysql : 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` BETWEEN (SELECT MIN(`customer`.`id`) AS `id_min` FROM `customer`) AND (SELECT MAX(`customer`.`id`) AS `id_max` FROM `customer`))',
  params: []
});
