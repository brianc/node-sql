'use strict';
var sql = require(__dirname + '/../../lib');

var Harness = require('./support');

var user = sql.define({
  name: 'user',
  columns: {
    id: { primaryKey: true }
  }
});

var photo = sql.define({
  name: 'photo',
  columns: {
    ownerId: {
      references: 'user'
    }
  }
});

var post = sql.define({
  name: 'post',
  columns: {
    id: { primaryKey: true },
    ownerId: {
      references: {
        table: 'user',
        column: 'id'
      }
    }
  }
});

Harness.test({
  query : user.joinTo(post),
  pg    : '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")',
  sqlite: '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")',
  mysql : '`user` INNER JOIN `post` ON (`user`.`id` = `post`.`ownerId`)'
});

Harness.test({
  query : post.joinTo(user),
  pg    : '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")',
  sqlite: '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")',
  mysql : '`post` INNER JOIN `user` ON (`user`.`id` = `post`.`ownerId`)'
});

Harness.test({
  query : user.joinTo(photo),
  pg    : '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")',
  sqlite: '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")',
  mysql : '`user` INNER JOIN `photo` ON (`user`.`id` = `photo`.`ownerId`)'
});
