'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var Sql = require('../../lib');

Harness.test({
  query: customer.select(Sql.functions.YEAR(customer.metadata)),
  pg: {
    text  : 'SELECT EXTRACT(YEAR FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(YEAR FROM "customer"."metadata") FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT strftime(\'%Y\', "customer"."metadata") FROM "customer"',
    string: 'SELECT strftime(\'%Y\', "customer"."metadata") FROM "customer"'
  },
  mysql: {
    text  : 'SELECT YEAR(`customer`.`metadata`) FROM `customer`',
    string: 'SELECT YEAR(`customer`.`metadata`) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT DATEPART(year, [customer].[metadata]) FROM [customer]',
    string: 'SELECT DATEPART(year, [customer].[metadata]) FROM [customer]'
  },
  oracle: {
    text  : 'SELECT EXTRACT(YEAR FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(YEAR FROM "customer"."metadata") FROM "customer"'
  },
  params: []
});

Harness.test({
  query: customer.select(Sql.functions.MONTH(customer.metadata)),
  pg: {
    text  : 'SELECT EXTRACT(MONTH FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(MONTH FROM "customer"."metadata") FROM "customer"'
  },
  sqlite: {
    text: 'SELECT strftime(\'%m\', datetime("customer"."metadata"/1000, "unixepoch")) FROM "customer"',
    string: 'SELECT strftime(\'%m\', datetime("customer"."metadata"/1000, "unixepoch")) FROM "customer"',
    config: {
      dateTimeMillis: true
    }
  },
  mysql: {
    text  : 'SELECT MONTH(`customer`.`metadata`) FROM `customer`',
    string: 'SELECT MONTH(`customer`.`metadata`) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT DATEPART(month, [customer].[metadata]) FROM [customer]',
    string: 'SELECT DATEPART(month, [customer].[metadata]) FROM [customer]'
  },
  oracle: {
    text  : 'SELECT EXTRACT(MONTH FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(MONTH FROM "customer"."metadata") FROM "customer"'
  },
  params: []
});

Harness.test({
  query: customer.select(Sql.functions.DAY(customer.metadata)),
  pg: {
    text  : 'SELECT EXTRACT(DAY FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(DAY FROM "customer"."metadata") FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT strftime(\'%d\', "customer"."metadata") FROM "customer"',
    string: 'SELECT strftime(\'%d\', "customer"."metadata") FROM "customer"'
  },
  mysql: {
    text  : 'SELECT DAY(`customer`.`metadata`) FROM `customer`',
    string: 'SELECT DAY(`customer`.`metadata`) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT DATEPART(day, [customer].[metadata]) FROM [customer]',
    string: 'SELECT DATEPART(day, [customer].[metadata]) FROM [customer]'
  },
  oracle: {
    text  : 'SELECT EXTRACT(DAY FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(DAY FROM "customer"."metadata") FROM "customer"'
  },
  params: []
});

Harness.test({
  query: customer.select(Sql.functions.HOUR(customer.metadata)),
  pg: {
    text  : 'SELECT EXTRACT(HOUR FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(HOUR FROM "customer"."metadata") FROM "customer"'
  },
  sqlite: {
    text: 'SELECT strftime(\'%H\', datetime("customer"."metadata"/1000, "unixepoch")) FROM "customer"',
    string: 'SELECT strftime(\'%H\', datetime("customer"."metadata"/1000, "unixepoch")) FROM "customer"',
    config: {
      dateTimeMillis: true
    }
  },
  mysql: {
    text  : 'SELECT HOUR(`customer`.`metadata`) FROM `customer`',
    string: 'SELECT HOUR(`customer`.`metadata`) FROM `customer`'
  },
  mssql: {
    text  : 'SELECT DATEPART(hour, [customer].[metadata]) FROM [customer]',
    string: 'SELECT DATEPART(hour, [customer].[metadata]) FROM [customer]'
  },
  oracle: {
    text  : 'SELECT EXTRACT(HOUR FROM "customer"."metadata") FROM "customer"',
    string: 'SELECT EXTRACT(HOUR FROM "customer"."metadata") FROM "customer"'
  },
  params: []
});

Harness.test({
  query: customer.select(Sql.functions.CURRENT_TIMESTAMP()),
  pg: {
    text  : 'SELECT CURRENT_TIMESTAMP FROM "customer"',
    string: 'SELECT CURRENT_TIMESTAMP FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT CURRENT_TIMESTAMP FROM "customer"',
    string: 'SELECT CURRENT_TIMESTAMP FROM "customer"'
  },
  mysql: {
    text  : 'SELECT CURRENT_TIMESTAMP FROM `customer`',
    string: 'SELECT CURRENT_TIMESTAMP FROM `customer`'
  },
  mssql: {
    text  : 'SELECT CURRENT_TIMESTAMP FROM [customer]',
    string: 'SELECT CURRENT_TIMESTAMP FROM [customer]'
  },
  oracle: {
    text  : 'SELECT CURRENT_TIMESTAMP FROM "customer"',
    string: 'SELECT CURRENT_TIMESTAMP FROM "customer"'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().plus(Sql.interval({hours:1}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1 HOUR\')',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1 HOUR\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1:0:0\' HOUR_SECOND)',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1:0:0\' HOUR_SECOND)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().minus(Sql.interval({years:3}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3 YEAR\')',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3 YEAR\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL 3 YEAR)',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL 3 YEAR)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().minus(Sql.interval({years:3, months:2}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3 YEAR 2 MONTH\')',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3 YEAR 2 MONTH\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3-2\' YEAR_MONTH)',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'3-2\' YEAR_MONTH)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().plus(Sql.interval({hours:1, minutes:20}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1 HOUR 20 MINUTE\')',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1 HOUR 20 MINUTE\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1:20:0\' HOUR_SECOND)',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'1:20:0\' HOUR_SECOND)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().plus(Sql.interval({hours:'sql\'injection', minutes:20}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'20 MINUTE\')',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'20 MINUTE\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'0:20:0\' HOUR_SECOND)',
    string: 'SELECT (CURRENT_TIMESTAMP + INTERVAL \'0:20:0\' HOUR_SECOND)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().minus(Sql.interval({days: 1, hours:5, minutes: 'sql\'injection'}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'1 DAY 5 HOUR\')',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'1 DAY 5 HOUR\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'1 5:0:0\' DAY_SECOND)',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'1 5:0:0\' DAY_SECOND)'
  },
  params: []
});

Harness.test({
  query: Sql.select(Sql.functions.CURRENT_TIMESTAMP().minus(Sql.interval({years: 2, months: 5}))),
  pg: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'2 YEAR 5 MONTH\')',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'2 YEAR 5 MONTH\')'
  },
  mysql: {
    text  : 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'2-5\' YEAR_MONTH)',
    string: 'SELECT (CURRENT_TIMESTAMP - INTERVAL \'2-5\' YEAR_MONTH)'
  },
  params: []
});

