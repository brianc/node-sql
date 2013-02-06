var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.select(user.id).from(user),
  pg    : 'SELECT "user"."id" FROM "user"'
});

Harness.test({
  query : user.select(user.id, user.name).from(user),
  pg    : 'SELECT "user"."id", "user"."name" FROM "user"'
});

Harness.test({
  query : user.select(user.star()).from(user),
  pg    : 'SELECT "user".* FROM "user"'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  params: ['foo']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').or(user.name.equals('bar'))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').and(user.name.equals('bar'))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) AND ("user"."name" = $2))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('bar')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" = $1) OR ("user"."name" = $2))'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('baz')).and(user.name.equals('bar')),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) OR ("user"."name" = $2)) AND ("user"."name" = $3))'
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.in(['foo', 'bar'])),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" IN ($1, $2))',
  params: ['foo', 'bar']
});

Harness.test({
  query : user.select(user.id).from(user).where(user.name.in(['foo', 'bar']).and(user.id.equals(1))),
  pg    : 'SELECT "user"."id" FROM "user" WHERE (("user"."name" IN ($1, $2)) AND ("user"."id" = $3))',
  params: ['foo', 'bar', 1]
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
   params: ['boom', 1, 'bang', 2]
});

Harness.test({
  query : user.select(user.name.as('user name'), user.id.as('user id')).from(user),
  pg    : 'SELECT "user"."name" as "user name", "user"."id" as "user id" FROM "user"'
});

Harness.test({
  query : user.select(user.name.as('user name')).from(user).where(user.name.equals('brian')),
  pg    : 'SELECT "user"."name" as "user name" FROM "user" WHERE ("user"."name" = $1)'
});

//Fix #10: prevent column state mutation
Harness.test({
  query : user.select(user.name).from(user).where(user.name.equals('brian')),
  pg    : 'SELECT "user"."name" FROM "user" WHERE ("user"."name" = $1)'
});

Harness.test({
  query : user.select('name').from('user').where('name <> NULL'),
  pg    : 'SELECT name FROM user WHERE name <> NULL'
});

Harness.test({
  query : user.select('name').from('user').where({name: 'brian'}),
  pg    : 'SELECT name FROM user WHERE ("user"."name" = $1)'
});