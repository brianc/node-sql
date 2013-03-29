'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

//FROM - SELECT
Harness.test({
  query : user.from(user.join(post).on(user.id.equals(post.userId))).select(user.name, post.content),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  sqlite: 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")',
  mysql : 'SELECT `user`.`name`, `post`.`content` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`)'
});

//WHERE - FROM - SELECT
Harness.test({
  query : user.where({name: ''}).from(user).select(user.id),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` = ?)',
  params: ['']
});

//SELECT - FROM - WHERE
Harness.test({
  query : user
            .select(user.name, post.content)
            .from(user.join(post).on(user.id.equals(post.userId)))
            .where({ name: '' }),
  pg    : 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`name`, `post`.`content` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`) WHERE (`user`.`name` = ?)',
  params: ['']
});

//SELECT - FROM - WHERE
Harness.test({
  query : user.select(user.id).from(user).where({name: ''}),
  pg    : 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  sqlite: 'SELECT "user"."id" FROM "user" WHERE ("user"."name" = $1)',
  mysql : 'SELECT `user`.`id` FROM `user` WHERE (`user`.`name` = ?)',
  params: ['']
});
