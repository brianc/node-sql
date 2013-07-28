'use strict';

var Harness = require('./support');
var customer = Harness.defineCustomerTable();
var post = Harness.definePostTable();

Harness.test({
  query: customer.select(customer.name.plus(customer.age)),
  pg: {
    text  : 'SELECT ("customer"."name" + "customer"."age") FROM "customer"',
    string: 'SELECT ("customer"."name" + "customer"."age") FROM "customer"'
  },
  sqlite: {
    text  : 'SELECT ("customer"."name" + "customer"."age") FROM "customer"',
    string: 'SELECT ("customer"."name" + "customer"."age") FROM "customer"'
  },
  mysql: {
    text  : 'SELECT (`customer`.`name` + `customer`.`age`) FROM `customer`',
    string: 'SELECT (`customer`.`name` + `customer`.`age`) FROM `customer`'
  },
  params: []
});

Harness.test({
  query: post.select(post.content.plus('!')).where(post.userId. in (customer.subQuery().select(customer.id))),
  pg: {
    text  : 'SELECT ("post"."content" + $1) FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))',
    string: 'SELECT ("post"."content" + \'!\') FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))'
  },
  sqlite: {
    text  : 'SELECT ("post"."content" + $1) FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))',
    string: 'SELECT ("post"."content" + \'!\') FROM "post" WHERE ("post"."userId" IN (SELECT "customer"."id" FROM "customer"))'
  },
  mysql: {
    text  : 'SELECT (`post`.`content` + ?) FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer`))',
    string: 'SELECT (`post`.`content` + \'!\') FROM `post` WHERE (`post`.`userId` IN (SELECT `customer`.`id` FROM `customer`))'
  },
  params: ['!']
});

Harness.test({
  query: post.select(post.id.plus(': ').plus(post.content)).where(post.userId.notIn(customer.subQuery().select(customer.id))),
  pg: {
    text  : 'SELECT (("post"."id" + $1) + "post"."content") FROM "post" WHERE ("post"."userId" NOT IN (SELECT "customer"."id" FROM "customer"))',
    string: 'SELECT (("post"."id" + \': \') + "post"."content") FROM "post" WHERE ("post"."userId" NOT IN (SELECT "customer"."id" FROM "customer"))'
  },
  sqlite: {
    text  : 'SELECT (("post"."id" + $1) + "post"."content") FROM "post" WHERE ("post"."userId" NOT IN (SELECT "customer"."id" FROM "customer"))',
    string: 'SELECT (("post"."id" + \': \') + "post"."content") FROM "post" WHERE ("post"."userId" NOT IN (SELECT "customer"."id" FROM "customer"))'
  },
  mysql: {
    text  : 'SELECT ((`post`.`id` + ?) + `post`.`content`) FROM `post` WHERE (`post`.`userId` NOT IN (SELECT `customer`.`id` FROM `customer`))',
    string: 'SELECT ((`post`.`id` + \': \') + `post`.`content`) FROM `post` WHERE (`post`.`userId` NOT IN (SELECT `customer`.`id` FROM `customer`))'
  },
  params: [': ']
});
