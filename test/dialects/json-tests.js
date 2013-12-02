'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var Sql = require('../../lib').setDialect('postgres');

Harness.test({
  query: customer.select(customer.metadata.key('age')),
  pg: {
    text  : 'SELECT ("customer"."metadata" -> $1) FROM "customer"',
    string: 'SELECT ("customer"."metadata" -> \'age\') FROM "customer"'
  },
  params: ['age']
});

Harness.test({
  query: customer.select(customer.metadata.keyText('age')),
  pg: {
    text  : 'SELECT ("customer"."metadata" ->> $1) FROM "customer"',
    string: 'SELECT ("customer"."metadata" ->> \'age\') FROM "customer"'
  },
  params: ['age']
});

Harness.test({
  query: customer.select(customer.metadata.path('{address,city}')),
  pg: {
    text  : 'SELECT ("customer"."metadata" #> $1) FROM "customer"',
    string: 'SELECT ("customer"."metadata" #> \'{address,city}\') FROM "customer"'
  },
  params: ['{address,city}']
});

Harness.test({
  query: customer.select(customer.metadata.pathText('{address,city}')),
  pg: {
    text  : 'SELECT ("customer"."metadata" #>> $1) FROM "customer"',
    string: 'SELECT ("customer"."metadata" #>> \'{address,city}\') FROM "customer"'
  },
  params: ['{address,city}']
});
