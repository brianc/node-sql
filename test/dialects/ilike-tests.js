'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();
var Sql = require('../../lib').setDialect('postgres');

Harness.test({
  query: post.select(post.content, post.userId).where(post.content.ilike('A%')),
  pg: {
    text  : 'SELECT "post"."content", "post"."userId" FROM "post" WHERE ("post"."content" ILIKE $1)',
    string: 'SELECT "post"."content", "post"."userId" FROM "post" WHERE ("post"."content" ILIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.content, post.userId)
      .select('\'test\'', user.id).from(user).where(user.name.ilike('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" ILIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" ILIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert([post.content, post.userId])
      .select('\'test\'', user.id).from(user).where(user.name.ilike('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" ILIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" ILIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.userId)
      .select(user.id).from(user).where(user.name.ilike('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" ILIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" ILIKE \'A%\')'
  },
  params: ['A%']
});
