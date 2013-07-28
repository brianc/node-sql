'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();

Harness.test({
  query: customer.select().where(customer.age.between(18, 25)),
  pg: {
    text  : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN $1 AND $2)',
    string: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN 18 AND 25)'
  },
  sqlite: {
    text  : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN $1 AND $2)',
    string: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" BETWEEN 18 AND 25)'
  },
  mysql: {
    text  : 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` BETWEEN ? AND ?)',
    string: 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` BETWEEN 18 AND 25)'
  },
  params: [18, 25]
});

Harness.test({
  query: post.select().where(post.userId.between(customer.subQuery().select(customer.id.min()), customer.subQuery().select(customer.id.max()))),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."userId" BETWEEN (SELECT MIN("customer"."id") AS "id_min" FROM "customer") AND (SELECT MAX("customer"."id") AS "id_max" FROM "customer"))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` BETWEEN (SELECT MIN(`customer`.`id`) AS `id_min` FROM `customer`) AND (SELECT MAX(`customer`.`id`) AS `id_max` FROM `customer`))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` BETWEEN (SELECT MIN(`customer`.`id`) AS `id_min` FROM `customer`) AND (SELECT MAX(`customer`.`id`) AS `id_max` FROM `customer`))'
  },
  params: []
});
