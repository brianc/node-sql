'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.select(user.id).from(user),
  pg    : 'SELECT "user"."id" FROM "user"',
  sqlite: 'SELECT "user"."id" FROM "user"',
  mysql : 'SELECT `user`.`id` FROM `user`'
});

Harness.test({
  query : user.select(user.id, user.name).from(user),
  pg    : 'SELECT "user"."id", "user"."name" FROM "user"',
  sqlite: 'SELECT "user"."id", "user"."name" FROM "user"',
  mysql : 'SELECT `user`.`id`, `user`.`name` FROM `user`'
});

Harness.test({
  query : user.select(user.star()).from(user),
  pg    : 'SELECT "user".* FROM "user"',
  sqlite: 'SELECT "user".* FROM "user"',
  mysql : 'SELECT `user`.* FROM `user`'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` = ?)',
  params: ['foo']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').or(user.name.equals('bar'))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) OR (`user`.`name` = ?))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').and(user.name.equals('bar'))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) AND ("user"."name" = $2))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) AND ("user"."name" = $2))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) AND (`user`.`name` = ?))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('bar')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` = ?) OR (`user`.`name` = ?))'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('baz')).and(user.name.equals('bar')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) OR ("user"."name" = $2)) AND ("user"."name" = $3))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) OR ("user"."name" = $2)) AND ("user"."name" = $3))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = ?) OR (`user`.`name` = ?)) AND (`user`.`name` = ?))'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name['in'](['foo', 'bar'])),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN ($1, $2))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN ($1, $2))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` IN (?, ?))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name['in'](['foo', 'bar']).and(user.id.equals(1))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN ($1, $2)) AND ("user"."id" = $3))',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN ($1, $2)) AND ("user"."id" = $3))',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE ((`user`.`name` IN (?, ?)) AND (`user`.`id` = ?))',
  params: ['foo', 'bar', 1]
});

Harness.test({
  query : user.select(user.columns),
  pg    : 'SELECT "user"."id", "user"."name" FROM "user"',
  sqlite: 'SELECT "user"."id", "user"."name" FROM "user"',
  mysql : 'SELECT `user`.`id`, `user`.`name` FROM `user`',
  params: []
});


Harness.test({
  query : user
    .select(user.id)
    .from(user)
    .where(
      user.name.equals('boom')
     .and(user.id.equals(1))
    ).or(
      user.name.equals('bang').and(user.id.equals(2))
    ),
   pg    : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) AND ("user"."id" = $2)) OR (("user"."name" = $3) AND ("user"."id" = $4)))',
   sqlite: 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) AND ("user"."id" = $2)) OR (("user"."name" = $3) AND ("user"."id" = $4)))',
   mysql : 'SELECT `user`.`id` FROM `user` WHERE (((`user`.`name` = ?) AND (`user`.`id` = ?)) OR ((`user`.`name` = ?) AND (`user`.`id` = ?)))',
   params: ['boom', 1, 'bang', 2]
});

Harness.test({
  query : user.select(user.name.as('user name'), user.id.as('user id')).from(user),
  pg    : 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"',
  sqlite: 'SELECT "user"."name" AS "user name", "user"."id" AS "user id" FROM "user"',
  mysql : 'SELECT `user`.`name` AS `user name`, `user`.`id` AS `user id` FROM `user`'
});

Harness.test({
  query : user.select(user.name.as('user name')).from(user).where(user.name.equals('brian')),
  pg    : 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."name" AS "user name" FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`name` AS `user name` FROM `user` WHERE (`user`.`name` = ?)',
  params: ['brian']
});

//Fix #10: prevent column state mutation
Harness.test({
  query : user.select(user.name).from(user).where(user.name.equals('brian')),
  pg    : 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`name` FROM `user` WHERE (`user`.`name` = ?)'
});

Harness.test({
  query : user.select('name').from('user').where('name <> NULL'),
  pg    : 'SELECT name FROM user WHERE (name <> NULL)',
  sqlite: 'SELECT name FROM user WHERE (name <> NULL)',
  mysql : 'SELECT name FROM user WHERE (name <> NULL)',
  params: []
});

Harness.test({
  query : user.select('name,id').from('user').where('name <> NULL'),
  pg    : 'SELECT name,id FROM user WHERE (name <> NULL)',
  sqlite: 'SELECT name,id FROM user WHERE (name <> NULL)',
  mysql : 'SELECT name,id FROM user WHERE (name <> NULL)',
  params: []
});

Harness.test({
  query : user.select('name','id').from('user').where('name <> NULL'),
  pg    : 'SELECT name, id FROM user WHERE (name <> NULL)',
  sqlite: 'SELECT name, id FROM user WHERE (name <> NULL)',
  mysql : 'SELECT name, id FROM user WHERE (name <> NULL)',
  params: []
});

Harness.test({
  query : user.select('name','id').from('user').where('name <> NULL').and('id <> NULL'),
  pg    : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
  sqlite: 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
  mysql : 'SELECT name, id FROM user WHERE ((name <> NULL) AND (id <> NULL))',
  params: []
});

Harness.test({
  query : user.select('name').from('user').where({name: 'brian'}),
  pg    : 'SELECT name FROM user WHERE ("user"."name" = $1)',
  sqlite: 'SELECT name FROM user WHERE ("user"."name" = $1)',
  mysql : 'SELECT name FROM user WHERE (`user`.`name` = ?)',
  params: ['brian']
});

Harness.test({
  query : user.select(user.name.as('quote"quote"tick`tick`')),
  pg    : 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"',
  sqlite: 'SELECT "user"."name" AS "quote""quote""tick`tick`" FROM "user"',
  mysql : 'SELECT `user`.`name` AS `quote"quote"tick``tick``` FROM `user`',
  params: []
});

Harness.test({
  query : user.select(user.star()).where(user.id['in'](user.subQuery().select(user.id))),
  pg    : 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))',
  sqlite: 'SELECT "user".* FROM "user" WHERE ("user"."id" IN (SELECT "user"."id" FROM "user"))',
  mysql : 'SELECT `user`.* FROM `user` WHERE (`user`.`id` IN (SELECT `user`.`id` FROM `user`))',
  params: []
});
