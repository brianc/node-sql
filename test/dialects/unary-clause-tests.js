'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();

Harness.test({
  query: customer.select().where(customer.age.isNotNull()),
  pg: {
    text  : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)',
    string: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)'
  },
  sqlite: {
    text  : 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)',
    string: 'SELECT "customer".* FROM "customer" WHERE ("customer"."age" IS NOT NULL)'
  },
  mysql: {
    text  : 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` IS NOT NULL)',
    string: 'SELECT `customer`.* FROM `customer` WHERE (`customer`.`age` IS NOT NULL)'
  },
  params: []
});

Harness.test({
  query: post.select().where(post.userId. in (customer.subQuery().select(customer.id).where(customer.age.isNull()))),
  pg: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))'
  },
  sqlite: {
    text  : 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))',
    string: 'SELECT "post".* FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer" WHERE ("customer"."age" IS NULL)))'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer` WHERE (`customer`.`age` IS NULL)))',
    string: 'SELECT `post`.* FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer` WHERE (`customer`.`age` IS NULL)))'
  },
  params: []
});
