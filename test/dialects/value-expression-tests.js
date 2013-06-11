'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var v = Harness.defineVariableTable();

// Test composition of binary methods +, *, -, =.
Harness.test({
  query : customer.select(customer.name, customer.income.modulo(100)).where(customer.age.plus(5).multiply(customer.age.minus(2)).equals(10)),
  pg    : 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  sqlite: 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  mysql : 'SELECT `customer`.`name`, (`customer`.`income` % ?) FROM `customer` WHERE (((`customer`.`age` + ?) * (`customer`.`age` - ?)) = ?)',
  params: [100, 5, 2, 10]
});

// Test composition of binary (e.g. +) and unary (e.g. like) methods.
Harness.test({
  query : customer.select(customer.name).where(customer.name.like(customer.id.plus('hello'))),
  pg    : 'SELECT "customer"."name" FROM "customer" WHERE ("customer"."name" LIKE ("customer"."id" + $1))',
  sqlite: 'SELECT "customer"."name" FROM "customer" WHERE ("customer"."name" LIKE ("customer"."id" + $1))',
  mysql : 'SELECT `customer`.`name` FROM `customer` WHERE (`customer`.`name` LIKE (`customer`.`id` + ?))',
  params: ['hello']
});

// Test implementing simple formulas.
// Acceleration formula. (a * t^2 / 2) + (v * t) = d
Harness.test({
  query : v.select(v.a.multiply(v.a).divide(2).plus(v.v.multiply(v.t)).equals(v.d)),
  pg    : 'SELECT (((("variable"."a" * "variable"."a") / $1) + ("variable"."v" * "variable"."t")) = "variable"."d") FROM "variable"',
  sqlite: 'SELECT (((("variable"."a" * "variable"."a") / $1) + ("variable"."v" * "variable"."t")) = "variable"."d") FROM "variable"',
  mysql : 'SELECT ((((`variable`.`a` * `variable`.`a`) / ?) + (`variable`.`v` * `variable`.`t`)) = `variable`.`d`) FROM `variable`',
  params: [2]
});

// Pythagorean theorem. a^2 + b^2 = c^2.
Harness.test({
  query : v.select(v.a.multiply(v.a).plus(v.b.multiply(v.b)).equals(v.c.multiply(v.c))),
  pg    : 'SELECT ((("variable"."a" * "variable"."a") + ("variable"."b" * "variable"."b")) = ("variable"."c" * "variable"."c")) FROM "variable"',
  sqlite: 'SELECT ((("variable"."a" * "variable"."a") + ("variable"."b" * "variable"."b")) = ("variable"."c" * "variable"."c")) FROM "variable"',
  mysql : 'SELECT (((`variable`.`a` * `variable`.`a`) + (`variable`.`b` * `variable`.`b`)) = (`variable`.`c` * `variable`.`c`)) FROM `variable`',
  params: []
});
