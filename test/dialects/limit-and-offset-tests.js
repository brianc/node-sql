'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

// For compatibility with PostgreSQL, MySQL also supports the LIMIT row_count OFFSET offset syntax.
// http://dev.mysql.com/doc/refman/5.0/en/select.html

Harness.test({
  query: user.select(user.star()).from(user).order(user.name.asc).limit(1),
  pg: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 1'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 1',
    string: 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 1'
  },
  params: []
});

Harness.test({
  query: user.select(user.star()).from(user).order(user.name.asc).limit(3).offset(6),
  pg: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" LIMIT 3 OFFSET 6'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 3 OFFSET 6',
    string: 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` LIMIT 3 OFFSET 6'
  },
  params: []
});

Harness.test({
  query: user.select(user.star()).from(user).order(user.name.asc).offset(10),
  pg: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10',
    string: 'SELECT "user".* FROM "user" ORDER BY "user"."name" OFFSET 10'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` OFFSET 10',
    string: 'SELECT `user`.* FROM `user` ORDER BY `user`.`name` OFFSET 10'
  },
  params: []
});

Harness.test({
  query: user.select(user.star()).where({
    name: 'John'
  }).offset(user.subQuery().select('FLOOR(RANDOM() * COUNT(*))').where({
    name: 'John'
  })).limit(1),
  pg: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."name" = $1) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = $2)) LIMIT 1',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."name" = \'John\') OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = \'John\')) LIMIT 1'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" WHERE ("user"."name" = $1) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = $2)) LIMIT 1',
    string: 'SELECT "user".* FROM "user" WHERE ("user"."name" = \'John\') OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM "user" WHERE ("user"."name" = \'John\')) LIMIT 1'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` WHERE (`user`.`name` = ?) OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM `user` WHERE (`user`.`name` = ?)) LIMIT 1',
    string: 'SELECT `user`.* FROM `user` WHERE (`user`.`name` = \'John\') OFFSET (SELECT FLOOR(RANDOM() * COUNT(*)) FROM `user` WHERE (`user`.`name` = \'John\')) LIMIT 1'
  },
  values: ['John', 'John']
});
