'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query  : customer.select(customer.name.isNull().as('nameIsNull')),
  pg     : 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"',
  sqlite : 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"',
  mysql  : 'SELECT (`customer`.`name` IS NULL) AS `nameIsNull` FROM `customer`',
  params : []
});

Harness.test({
  query  : customer.select(customer.name.plus(customer.age).as('nameAndAge')).where(customer.age.gt(10).and(customer.age.lt(20))),
  pg     : 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > $1) AND ("customer"."age" < $2))',
  sqlite : 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > $1) AND ("customer"."age" < $2))',
  mysql  : 'SELECT (`customer`.`name` + `customer`.`age`) AS `nameAndAge` FROM `customer` WHERE ((`customer`.`age` > ?) AND (`customer`.`age` < ?))',
  params : [10, 20]
});

Harness.test({
  query  : customer.select(customer.age.between(10, 20).as('ageBetween')),
  pg     : 'SELECT ("customer"."age" BETWEEN $1 AND $2) AS "ageBetween" FROM "customer"',
  sqlite : 'SELECT ("customer"."age" BETWEEN $1 AND $2) AS "ageBetween" FROM "customer"',
  mysql  : 'SELECT (`customer`.`age` BETWEEN ? AND ?) AS `ageBetween` FROM `customer`',
  params : [10, 20]
});
