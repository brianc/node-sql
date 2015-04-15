'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerCompositeTable();
var Sql = require('../../lib').setDialect('postgres');

Harness.test({
  query: customer.select(customer.info.subfields.age),
  pg: {
    text  : 'SELECT ("customer"."info")."age" FROM "customer"',
    string: 'SELECT ("customer"."info")."age" FROM "customer"'
  },
  params: []
});


Harness.test({
  query: customer.select(customer.info.subfields.age.as('years')),
  pg: {
    text  : 'SELECT ("customer"."info")."age" AS "years" FROM "customer"',
    string: 'SELECT ("customer"."info")."age" AS "years" FROM "customer"'
  },
  params: []
});

Harness.test({
  query: customer.select(customer.id).where(customer.info.subfields.salary.equals(10)),
  pg: {
    text  : 'SELECT "customer"."id" FROM "customer" WHERE (("customer"."info")."salary" = $1)',
    string: 'SELECT "customer"."id" FROM "customer" WHERE (("customer"."info")."salary" = 10)'
  },
  params: [10]
});

Harness.test({
  query: customer.select(customer.info.subfields.name.distinct()),
  pg: {
    text  : 'SELECT DISTINCT(("customer"."info")."name") FROM "customer"',
    string: 'SELECT DISTINCT(("customer"."info")."name") FROM "customer"'
  },
  params: []
});
