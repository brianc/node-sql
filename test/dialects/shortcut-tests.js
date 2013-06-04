'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();
var customer = Harness.defineCustomerTable();

// shortcut: 'select * from <table>'
Harness.test({
  query : user,
  pg    : 'SELECT "user".* FROM "user"',
  sqlite: 'SELECT "user".* FROM "user"',
  mysql : 'SELECT `user`.* FROM `user`'
});

Harness.test({
  query : user.where(user.name.equals(3)),
  pg    : 'SELECT * FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT * FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT * FROM `user` WHERE (`user`.`name` = ?)',
  params : [3]
});

Harness.test({
  query : user.where(user.name.equals(3)).where(user.id.equals(1)),
  pg    : 'SELECT * FROM "user" WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
  sqlite: 'SELECT * FROM "user" WHERE (("user"."name" = $1) AND ("user"."id" = $2))',
  mysql : 'SELECT * FROM `user` WHERE ((`user`.`name` = ?) AND (`user`.`id` = ?))',
  params: [3,1]
});

// shortcut: no 'from'
Harness.test({
  query : post.select(post.content),
  pg    : 'SELECT "post"."content" FROM "post"',
  sqlite: 'SELECT "post"."content" FROM "post"',
  mysql : 'SELECT `post`.`content` FROM `post`'
});

Harness.test({
  query : post.select(post.content).where(post.userId.equals(1)),
  pg    : 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = $1)',
  sqlite: 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = $1)',
  mysql : 'SELECT `post`.`content` FROM `post` WHERE (`post`.`userId` = ?)',
  params: [1]
});

Harness.test({
  query : post.where(post.content.isNull()).or({content: ''}).and({userId: 1}),
  pg    : 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = $1)) AND ("post"."userId" = $2))',
  sqlite: 'SELECT * FROM "post" WHERE ((("post"."content" IS NULL) OR ("post"."content" = $1)) AND ("post"."userId" = $2))',
  mysql : 'SELECT * FROM `post` WHERE (((`post`.`content` IS NULL) OR (`post`.`content` = ?)) AND (`post`.`userId` = ?))',
  params: ['', 1]
});

Harness.test({
  query : customer.select(customer.name, customer.income.modulo(100)).where(customer.age.add(5).multiply(customer.age.subtract(2)).equals(10)),
  pg    : 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  sqlite: 'SELECT "customer"."name", ("customer"."income" % $1) FROM "customer" WHERE ((("customer"."age" + $2) * ("customer"."age" - $3)) = $4)',
  mysql : 'SELECT `customer`.`name`, (`customer`.`income` % ?) FROM `customer` WHERE (((`customer`.`age` + ?) * (`customer`.`age` - ?)) = ?)',
  params: [100, 5, 2, 10]
});
