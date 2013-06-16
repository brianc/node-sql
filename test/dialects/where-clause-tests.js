'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.where(user.id.isNotNull(), user.name.isNotNull()),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  params: []
});

Harness.test({
  query: user.and(user.id.isNotNull(), user.name.isNotNull()),
  pg: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  mysql: {
    text  : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
    string: 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))'
  },
  sqlite: {
    text  : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
    string: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
  },
  params: []
});
