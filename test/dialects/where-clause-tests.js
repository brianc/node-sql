'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query : user.where(user.id.isNotNull(), user.name.isNotNull()),
  pg    : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
  mysql : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
  sqlite: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
});

Harness.test({
  query : user.and(user.id.isNotNull(), user.name.isNotNull()),
  pg    : 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))',
  mysql : 'SELECT * FROM `user` WHERE ((`user`.`id` IS NOT NULL) AND (`user`.`name` IS NOT NULL))',
  sqlite: 'SELECT * FROM "user" WHERE (("user"."id" IS NOT NULL) AND ("user"."name" IS NOT NULL))'
});
