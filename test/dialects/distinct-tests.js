'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.select(user.id.distinct()),
  pg: {
    text  : 'SELECT DISTINCT("user"."id") FROM "user"',
    string: 'SELECT DISTINCT("user"."id") FROM "user"'
  },
  sqlite: {
    text  : 'SELECT DISTINCT("user"."id") FROM "user"',
    string: 'SELECT DISTINCT("user"."id") FROM "user"'
  },
  mysql: {
    text  : 'SELECT DISTINCT(`user`.`id`) FROM `user`',
    string: 'SELECT DISTINCT(`user`.`id`) FROM `user`'
  },
  params: []
});

Harness.test({
  query: user.select(user.id.count().distinct().as('count')),
  pg: {
    text  : 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"',
    string: 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"'
  },
  sqlite: {
    text  : 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"',
    string: 'SELECT COUNT(DISTINCT("user"."id")) AS "count" FROM "user"'
  },
  mysql: {
    text  : 'SELECT COUNT(DISTINCT(`user`.`id`)) AS `count` FROM `user`',
    string: 'SELECT COUNT(DISTINCT(`user`.`id`)) AS `count` FROM `user`'
  },
  params: []
});
