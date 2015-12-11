'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var Sql = require('../../lib').setDialect('postgres');

Harness.test({
  query: user.select().distinctOn(user.id),
  pg: {
    text  : 'SELECT DISTINCT ON("user"."id") "user".* FROM "user"',
    string: 'SELECT DISTINCT ON("user"."id") "user".* FROM "user"'
  },
  params: []
});

Harness.test({
  query: user.select(user.id,user.name).distinctOn(user.id),
  pg: {
    text  : 'SELECT DISTINCT ON("user"."id") "user"."id", "user"."name" FROM "user"',
    string: 'SELECT DISTINCT ON("user"."id") "user"."id", "user"."name" FROM "user"'
  },
  params: []
});

