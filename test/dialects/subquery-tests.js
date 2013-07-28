'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var user = Harness.defineUserTable();
var Sql = require('../../lib');

Harness.test({
  query: user.name.in(
    customer.subQuery().select(customer.name).where(
      user.name.in(
        customer.subQuery().select(customer.name).where(
          user.name.like('%HELLO%'))))),
  pg: {
    text  : '("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" LIKE $1)))))',
    string: '("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" LIKE \'%HELLO%\')))))'
  },
  sqlite: {
    text  : '("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" LIKE $1)))))',
    string: '("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" IN (SELECT "customer"."name" FROM "customer" WHERE ("user"."name" LIKE \'%HELLO%\')))))'
  },
  mysql: {
    text  : '(`user`.`name` IN (SELECT `customer`.`name` FROM `customer` WHERE (`user`.`name` IN (SELECT `customer`.`name` FROM `customer` WHERE (`user`.`name` LIKE ?)))))',
    string: '(`user`.`name` IN (SELECT `customer`.`name` FROM `customer` WHERE (`user`.`name` IN (SELECT `customer`.`name` FROM `customer` WHERE (`user`.`name` LIKE \'%HELLO%\')))))'
  },
  params: ['%HELLO%']
});

Harness.test({
  query: Sql.select('*').from(user.subQuery()),
  pg: {
    text  : 'SELECT * FROM (SELECT * FROM "user")',
    string: 'SELECT * FROM (SELECT * FROM "user")'
  },
  sqlite: {
    text  : 'SELECT * FROM (SELECT * FROM "user")',
    string: 'SELECT * FROM (SELECT * FROM "user")'
  },
  mysql: {
    text  : 'SELECT * FROM (SELECT * FROM `user`)',
    string: 'SELECT * FROM (SELECT * FROM `user`)'
  },
  params: []
});

Harness.test({
  query: Sql.select('*').from(customer.subQuery('T1')).from(user.subQuery('T2')),
  pg: {
    text  : 'SELECT * FROM (SELECT * FROM "customer") T1 , (SELECT * FROM "user") T2',
    string: 'SELECT * FROM (SELECT * FROM "customer") T1 , (SELECT * FROM "user") T2'
  },
  sqlite: {
    text  : 'SELECT * FROM (SELECT * FROM "customer") T1 , (SELECT * FROM "user") T2',
    string: 'SELECT * FROM (SELECT * FROM "customer") T1 , (SELECT * FROM "user") T2'
  },
  mysql: {
    text  : 'SELECT * FROM (SELECT * FROM `customer`) T1 , (SELECT * FROM `user`) T2',
    string: 'SELECT * FROM (SELECT * FROM `customer`) T1 , (SELECT * FROM `user`) T2'
  },
  params: []
});

Harness.test({
  query: customer.name.between(
    customer.subQuery().select(Sql.functions.MIN(customer.name)),
    customer.subQuery().select(Sql.functions.MAX(customer.name))
    ),
  pg: {
    text  : '("customer"."name" BETWEEN (SELECT MIN("customer"."name") FROM "customer") AND (SELECT MAX("customer"."name") FROM "customer"))',
    string: '("customer"."name" BETWEEN (SELECT MIN("customer"."name") FROM "customer") AND (SELECT MAX("customer"."name") FROM "customer"))'
  },
  sqlite: {
    text  : '("customer"."name" BETWEEN (SELECT MIN("customer"."name") FROM "customer") AND (SELECT MAX("customer"."name") FROM "customer"))',
    string: '("customer"."name" BETWEEN (SELECT MIN("customer"."name") FROM "customer") AND (SELECT MAX("customer"."name") FROM "customer"))'
  },
  mysql: {
    text  : '(`customer`.`name` BETWEEN (SELECT MIN(`customer`.`name`) FROM `customer`) AND (SELECT MAX(`customer`.`name`) FROM `customer`))',
    string: '(`customer`.`name` BETWEEN (SELECT MIN(`customer`.`name`) FROM `customer`) AND (SELECT MAX(`customer`.`name`) FROM `customer`))'
  },
  params: []
});

Harness.test({
  query: user.subQuery().where(user.name.equals(customer.name)).exists(),
  pg: {
    text  : '(EXISTS (SELECT * FROM "user" WHERE ("user"."name" = "customer"."name")))',
    string: '(EXISTS (SELECT * FROM "user" WHERE ("user"."name" = "customer"."name")))'
  },
  sqlite: {
    text  : '(EXISTS (SELECT * FROM "user" WHERE ("user"."name" = "customer"."name")))',
    string: '(EXISTS (SELECT * FROM "user" WHERE ("user"."name" = "customer"."name")))'
  },
  mysql: {
    text  : '(EXISTS (SELECT * FROM `user` WHERE (`user`.`name` = `customer`.`name`)))',
    string: '(EXISTS (SELECT * FROM `user` WHERE (`user`.`name` = `customer`.`name`)))'
  },
  params: []
});
