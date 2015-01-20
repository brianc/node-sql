'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();

// Check case expression with primary when expressions and else branch.
Harness.test({
  query: customer.select(customer.age.case([true, false], [0, 1], 2)),
  pg: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN ? THEN ? WHEN ? THEN ? ELSE ? END) FROM `customer`',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN 1=1 THEN @1 WHEN 0=1 THEN @2 ELSE @3 END) FROM [customer]',
    string: 'SELECT (CASE WHEN 1=1 THEN 0 WHEN 0=1 THEN 1 ELSE 2 END) FROM [customer]',
    params: [0, 1, 2]
  },
  params: [true, 0, false, 1, 2]
});

// Check case expression as a subexpression.
Harness.test({
  query: customer.select(customer.age.plus(customer.age.case([true, false], [0, 1], 2))),
  pg: {
    text  : 'SELECT ("customer"."age" + (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END)) FROM "customer"',
    string: 'SELECT ("customer"."age" + (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END)) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ("customer"."age" + (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END)) FROM "customer"',
    string: 'SELECT ("customer"."age" + (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END)) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (`customer`.`age` + (CASE WHEN ? THEN ? WHEN ? THEN ? ELSE ? END)) FROM `customer`',
    string: 'SELECT (`customer`.`age` + (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END)) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT ([customer].[age] + (CASE WHEN 1=1 THEN @1 WHEN 0=1 THEN @2 ELSE @3 END)) FROM [customer]',
    string: 'SELECT ([customer].[age] + (CASE WHEN 1=1 THEN 0 WHEN 0=1 THEN 1 ELSE 2 END)) FROM [customer]',
    params: [0, 1, 2]
  },
  params: [true, 0, false, 1, 2]
});

// Check case expression as subexpression on the left.
Harness.test({
  query: customer.select(customer.age.case([true, false], [0, 1], 2).plus(3)),
  pg: {
    text  : 'SELECT ((CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END) + $6) FROM "customer"',
    string: 'SELECT ((CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) + 3) FROM "customer"',
  },
  sqlite: {
    text  : 'SELECT ((CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE $5 END) + $6) FROM "customer"',
    string: 'SELECT ((CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) + 3) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT ((CASE WHEN ? THEN ? WHEN ? THEN ? ELSE ? END) + ?) FROM `customer`',
    string: 'SELECT ((CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE 2 END) + 3) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT ((CASE WHEN 1=1 THEN @1 WHEN 0=1 THEN @2 ELSE @3 END) + @4) FROM [customer]',
    string: 'SELECT ((CASE WHEN 1=1 THEN 0 WHEN 0=1 THEN 1 ELSE 2 END) + 3) FROM [customer]',
    params: [0, 1, 2, 3]
  },
  params: [true, 0, false, 1, 2, 3]
});

// Check case expression with primary when expressions and compound else expression.
Harness.test({
  query: customer.select(customer.age.case([true, false], [0, 1], customer.age.between(10, 20))),
  pg: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE ("customer"."age" BETWEEN $5 AND $6) END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE ("customer"."age" BETWEEN 10 AND 20) END) FROM "customer"',
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 ELSE ("customer"."age" BETWEEN $5 AND $6) END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE ("customer"."age" BETWEEN 10 AND 20) END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN ? THEN ? WHEN ? THEN ? ELSE (`customer`.`age` BETWEEN ? AND ?) END) FROM `customer`',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 ELSE (`customer`.`age` BETWEEN 10 AND 20) END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN 1=1 THEN @1 WHEN 0=1 THEN @2 ELSE ([customer].[age] BETWEEN @3 AND @4) END) FROM [customer]',
    string: 'SELECT (CASE WHEN 1=1 THEN 0 WHEN 0=1 THEN 1 ELSE ([customer].[age] BETWEEN 10 AND 20) END) FROM [customer]',
    params: [0, 1, 10, 20]
  },
  params: [true, 0, false, 1, 10, 20]
});

// Check case expression with primary when expressions without else branch.
Harness.test({
  query: customer.select(customer.age.case([true, false], [0, 1])),
  pg: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 END) FROM "customer"',
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN $1 THEN $2 WHEN $3 THEN $4 END) FROM "customer"',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN ? THEN ? WHEN ? THEN ? END) FROM `customer`',
    string: 'SELECT (CASE WHEN TRUE THEN 0 WHEN FALSE THEN 1 END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN 1=1 THEN @1 WHEN 0=1 THEN @2 END) FROM [customer]',
    string: 'SELECT (CASE WHEN 1=1 THEN 0 WHEN 0=1 THEN 1 END) FROM [customer]',
    params: [0, 1]
  },
  params: [true, 0, false, 1]
});

// Check case expression with compound when expressions and else branch.
Harness.test({
  query: customer.select(customer.age.case([customer.age.in([10, 20, 30]), customer.age.lte(60)], [0, 1], 2)),
  pg: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN $4 WHEN ("customer"."age" <= $5) THEN $6 ELSE $7 END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN 0 WHEN ("customer"."age" <= 60) THEN 1 ELSE 2 END) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN $4 WHEN ("customer"."age" <= $5) THEN $6 ELSE $7 END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN 0 WHEN ("customer"."age" <= 60) THEN 1 ELSE 2 END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN (`customer`.`age` IN (?, ?, ?)) THEN ? WHEN (`customer`.`age` <= ?) THEN ? ELSE ? END) FROM `customer`',
    string: 'SELECT (CASE WHEN (`customer`.`age` IN (10, 20, 30)) THEN 0 WHEN (`customer`.`age` <= 60) THEN 1 ELSE 2 END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN ([customer].[age] IN (@1, @2, @3)) THEN @4 WHEN ([customer].[age] <= @5) THEN @6 ELSE @7 END) FROM [customer]',
    string: 'SELECT (CASE WHEN ([customer].[age] IN (10, 20, 30)) THEN 0 WHEN ([customer].[age] <= 60) THEN 1 ELSE 2 END) FROM [customer]'
  },
  params: [10, 20, 30, 0, 60, 1, 2]
});

// Check case expression without else branch.
Harness.test({
  query: customer.select(customer.age.case([customer.age.in([10, 20, 30]), customer.age.lte(60)], [0, 1])),
  pg: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN $4 WHEN ("customer"."age" <= $5) THEN $6 END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN 0 WHEN ("customer"."age" <= 60) THEN 1 END) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN $4 WHEN ("customer"."age" <= $5) THEN $6 END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN 0 WHEN ("customer"."age" <= 60) THEN 1 END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN (`customer`.`age` IN (?, ?, ?)) THEN ? WHEN (`customer`.`age` <= ?) THEN ? END) FROM `customer`',
    string: 'SELECT (CASE WHEN (`customer`.`age` IN (10, 20, 30)) THEN 0 WHEN (`customer`.`age` <= 60) THEN 1 END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN ([customer].[age] IN (@1, @2, @3)) THEN @4 WHEN ([customer].[age] <= @5) THEN @6 END) FROM [customer]',
    string: 'SELECT (CASE WHEN ([customer].[age] IN (10, 20, 30)) THEN 0 WHEN ([customer].[age] <= 60) THEN 1 END) FROM [customer]'
  },
  params: [10, 20, 30, 0, 60, 1]
});

// Check case expression with compound then expressions.
Harness.test({
  query: customer.select(customer.age.case([customer.age.in([10, 20, 30]), customer.age.lte(60)], [customer.age.plus(5), customer.age.minus(1)])),
  pg: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN ("customer"."age" + $4) WHEN ("customer"."age" <= $5) THEN ("customer"."age" - $6) END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN ("customer"."age" + 5) WHEN ("customer"."age" <= 60) THEN ("customer"."age" - 1) END) FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT (CASE WHEN ("customer"."age" IN ($1, $2, $3)) THEN ("customer"."age" + $4) WHEN ("customer"."age" <= $5) THEN ("customer"."age" - $6) END) FROM "customer"',
    string: 'SELECT (CASE WHEN ("customer"."age" IN (10, 20, 30)) THEN ("customer"."age" + 5) WHEN ("customer"."age" <= 60) THEN ("customer"."age" - 1) END) FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (CASE WHEN (`customer`.`age` IN (?, ?, ?)) THEN (`customer`.`age` + ?) WHEN (`customer`.`age` <= ?) THEN (`customer`.`age` - ?) END) FROM `customer`',
    string: 'SELECT (CASE WHEN (`customer`.`age` IN (10, 20, 30)) THEN (`customer`.`age` + 5) WHEN (`customer`.`age` <= 60) THEN (`customer`.`age` - 1) END) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT (CASE WHEN ([customer].[age] IN (@1, @2, @3)) THEN ([customer].[age] + @4) WHEN ([customer].[age] <= @5) THEN ([customer].[age] - @6) END) FROM [customer]',
    string: 'SELECT (CASE WHEN ([customer].[age] IN (10, 20, 30)) THEN ([customer].[age] + 5) WHEN ([customer].[age] <= 60) THEN ([customer].[age] - 1) END) FROM [customer]'
  },
  params: [10, 20, 30, 5, 60, 1]
});
