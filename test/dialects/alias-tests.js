'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query: customer.select(customer.name.isNull().as('nameIsNull')),
  pg: {
    text  : 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"',
    string: 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"',
    string: 'SELECT ("customer"."name" IS NULL) AS "nameIsNull" FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (`customer`.`name` IS NULL) AS `nameIsNull` FROM `customer`',
    string: 'SELECT (`customer`.`name` IS NULL) AS `nameIsNull` FROM `customer`'
  },
  params: []
});

Harness.test({
  query: customer.select(customer.name.plus(customer.age).as('nameAndAge')).where(customer.age.gt(10).and(customer.age.lt(20))),
  pg: {
    text  : 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > $1) AND ("customer"."age" < $2))',
    string: 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > 10) AND ("customer"."age" < 20))'
  },
  sqlite: {
    text  : 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > $1) AND ("customer"."age" < $2))',
    string: 'SELECT ("customer"."name" + "customer"."age") AS "nameAndAge" FROM "customer" WHERE (("customer"."age" > 10) AND ("customer"."age" < 20))'
  },
  mysql: {
    text  : 'SELECT (`customer`.`name` + `customer`.`age`) AS `nameAndAge` FROM `customer` WHERE ((`customer`.`age` > ?) AND (`customer`.`age` < ?))',
    string: 'SELECT (`customer`.`name` + `customer`.`age`) AS `nameAndAge` FROM `customer` WHERE ((`customer`.`age` > 10) AND (`customer`.`age` < 20))'
  },
  params: [10, 20]
});

Harness.test({
  query: customer.select(customer.age.between(10, 20).as('ageBetween')),
  pg: {
    text  : 'SELECT ("customer"."age" BETWEEN $1 AND $2) AS "ageBetween" FROM "customer"',
    string: 'SELECT ("customer"."age" BETWEEN 10 AND 20) AS "ageBetween" FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ("customer"."age" BETWEEN $1 AND $2) AS "ageBetween" FROM "customer"',
    string: 'SELECT ("customer"."age" BETWEEN 10 AND 20) AS "ageBetween" FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (`customer`.`age` BETWEEN ? AND ?) AS `ageBetween` FROM `customer`',
    string: 'SELECT (`customer`.`age` BETWEEN 10 AND 20) AS `ageBetween` FROM `customer`'
  },
  params: [10, 20]
});
