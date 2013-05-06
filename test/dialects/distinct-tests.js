'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.select(user.id.distinct()),
  pg    : 'SELECT DISTINCT("user"."id") FROM "user"'
});
