'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.select(user.id.distinct()),
  pg    : 'SELECT DISTINCT("user"."id") FROM "user"'
});

Harness.test({
  query : user.select(user.id.count().distinct().as('count')),
  pg    : 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"'
});
