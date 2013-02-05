var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).limit(1),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1'
});

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).limit(3).offset(6),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6'
});

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).offset(10),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10'
});
