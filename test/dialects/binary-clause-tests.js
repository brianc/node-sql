'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query : customer.select(customer.name.add(customer.age)),
  pg    : 'SELECT ("customer"."name" + "customer"."age") FROM "customer"',
  sqlite: 'SELECT ("customer"."name" + "customer"."age") FROM "customer"',
  mysql : 'SELECT (`customer`.`name` + `customer`.`age`) FROM `customer`',
  params: []
});

Harness.test({
  query : post.select(post.content.add('!')).where(post.userId.in(customer.subQuery().select(customer.id))),
  pg    : 'SELECT ("post"."content" + $1) FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))',
  sqlite: 'SELECT ("post"."content" + $1) FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))',
  mysql : 'SELECT (`post`.`content` + ?) FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer`))',
  params: ['!']
});
