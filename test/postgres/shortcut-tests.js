var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

//shortcut: 'select * from <table>'
Harness.test({
  query : user,
  pg    : 'SELECT "user".* FROM "user"'
});

Harness.test({
  query : user.where(user.name.equals(3)),
  pg    : 'SELECT "user".* FROM "user" WHERE ("user"."name" = $1)'
});

Harness.test({
  query : user.where(user.name.equals(3)).where(user.id.equals(1)),
  pg    : 'SELECT "user".* FROM "user" WHERE (("user"."name" = $1) AND ("user"."id" = $2))'
});

//shortcut: no 'from'
Harness.test({
  query : post.select(post.content),
  pg    : 'SELECT "post"."content" FROM "post"'
});

Harness.test({
  query : post.select(post.content).where(post.userId.equals(1)),
  pg    : 'SELECT "post"."content" FROM "post" WHERE ("post"."userId" = $1)'
});



