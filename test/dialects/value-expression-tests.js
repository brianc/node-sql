'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();

Harness.test({
  query : customer.select(customer.name, customer.income.modulo(100)).where(customer.age.add(5).multiply(customer.age.subtract(2)).equals(10)),
  pg    : 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  sqlite: 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  mysql : 'SELECT `customer`.`name`, (`customer`.`income` % ?) FROM `customer` WHERE (((`customer`.`age` + ?) * (`customer`.`age` - ?)) = ?)',
  params: [100, 5, 2, 10]
});
