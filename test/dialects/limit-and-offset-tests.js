'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

// For compatibility with PostgreSQL, MySQL also supports the LIMIT row_count OFFSET offset syntax.
// http://dev.mysql.com/doc/refman/5.0/en/select.html

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).limit(1),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1',
  sqlite: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1',
  mysql : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 1'
});

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).limit(3).offset(6),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6',
  sqlite: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6',
  mysql : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 3 OFFSET 6'
});

Harness.test({
  query : user.select(user.star()).from(user).order(user.name.asc).offset(10),
  pg    : 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10',
  sqlite: 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10',
  mysql : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` OFFSET 10'
});

Harness.test({
  query : user.select(user.star()).where({name: 'John'}).offset(user.subQuery().select('FLOOR(RANDOM() * COUNT(*))').where({name: 'John'})).limit(1),
  pg    : 'SELECT "user".* FROM "user" WHERE ("user"."name" = $1) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = $2)) LIMIT 1',
  sqlite: 'SELECT "user".* FROM "user" WHERE ("user"."name" = $1) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = $2)) LIMIT 1',
  mysql : 'SELECT `user`.* FROM `user` WHERE (`user`.`name` = ?) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM `user` WHERE (`user`.`name` = ?)) LIMIT 1',
  values: ['John', 'John']
});
