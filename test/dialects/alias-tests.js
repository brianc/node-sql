'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var Sql = require('../../lib').setDialect('postgres');

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
  mssql: {
    text  : 'SELECT ([customer].[name] IS NULL) AS [nameIsNull] FROM [customer]',
    string: 'SELECT ([customer].[name] IS NULL) AS [nameIsNull] FROM [customer]'
  },
  oracle: {
    text  : 'SELECT ("customer"."name" IS NULL) "nameIsNull" FROM "customer"',
    string: 'SELECT ("customer"."name" IS NULL) "nameIsNull" FROM "customer"'
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
  mssql: {
    text  : 'SELECT ([customer].[name] + [customer].[age]) AS [nameAndAge] FROM [customer] WHERE (([customer].[age] > @1) AND ([customer].[age] < @2))',
    string: 'SELECT ([customer].[name] + [customer].[age]) AS [nameAndAge] FROM [customer] WHERE (([customer].[age] > 10) AND ([customer].[age] < 20))'
  },
  oracle: {
    text  : 'SELECT ("customer"."name" + "customer"."age") "nameAndAge" FROM "customer" WHERE (("customer"."age" > :1) AND ("customer"."age" < :2))',
    string: 'SELECT ("customer"."name" + "customer"."age") "nameAndAge" FROM "customer" WHERE (("customer"."age" > 10) AND ("customer"."age" < 20))'
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
  mssql: {
    text  : 'SELECT ([customer].[age] BETWEEN @1 AND @2) AS [ageBetween] FROM [customer]',
    string: 'SELECT ([customer].[age] BETWEEN 10 AND 20) AS [ageBetween] FROM [customer]'
  },
  oracle: {
    text  : 'SELECT ("customer"."age" BETWEEN :1 AND :2) "ageBetween" FROM "customer"',
    string: 'SELECT ("customer"."age" BETWEEN 10 AND 20) "ageBetween" FROM "customer"'
  },
  params: [10, 20]
});

Harness.test({
  query: customer.select(Sql.functions.ROUND(customer.age.as('ageBetween'), 2)),
  pg: {
    text  : 'SELECT ROUND("customer"."age", $1) FROM "customer"',
    string: 'SELECT ROUND("customer"."age", 2) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ROUND("customer"."age", $1) FROM "customer"',
    string: 'SELECT ROUND("customer"."age", 2) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT ROUND(`customer`.`age`, ?) FROM `customer`',
    string: 'SELECT ROUND(`customer`.`age`, 2) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT ROUND([customer].[age], @1) FROM [customer]',
    string: 'SELECT ROUND([customer].[age], 2) FROM [customer]'
  },
  oracle: {
    text  : 'SELECT ROUND("customer"."age", :1) FROM "customer"',
    string: 'SELECT ROUND("customer"."age", 2) FROM "customer"'
  },
  params: [2]
});

Harness.test({
  query: customer.select(customer.age.notBetween(10, 20).as('ageNotBetween')),
  pg: {
    text  : 'SELECT ("customer"."age" NOT BETWEEN $1 AND $2) AS "ageNotBetween" FROM "customer"',
    string: 'SELECT ("customer"."age" NOT BETWEEN 10 AND 20) AS "ageNotBetween" FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ("customer"."age" NOT BETWEEN $1 AND $2) AS "ageNotBetween" FROM "customer"',
    string: 'SELECT ("customer"."age" NOT BETWEEN 10 AND 20) AS "ageNotBetween" FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (`customer`.`age` NOT BETWEEN ? AND ?) AS `ageNotBetween` FROM `customer`',
    string: 'SELECT (`customer`.`age` NOT BETWEEN 10 AND 20) AS `ageNotBetween` FROM `customer`'
  },
  params: [10, 20]
});
