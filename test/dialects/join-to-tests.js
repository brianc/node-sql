'use strict';
var sql = require(__dirname + '/../../lib');

var Harness = require('./support');

var user = sql.define({
  name: 'user',
  columns: {
    id: {
      primaryKey: true
    }
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
    id: {
      primaryKey: true
    },
    ownerId: {
      references: {
        table: 'user',
        column: 'id'
      }
    }
  }
});

Harness.test({
  query: user.joinTo(post),
  pg: {
    text  : '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")',
    string: '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")'
  },
  sqlite: {
    text  : '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")',
    string: '"user" INNER JOIN "post" ON ("user"."id" = "post"."ownerId")'
  },
  mysql: {
    text  : '`user` INNER JOIN `post` ON (`user`.`id` = `post`.`ownerId`)',
    string: '`user` INNER JOIN `post` ON (`user`.`id` = `post`.`ownerId`)'
  },
  params: []
});

Harness.test({
  query: post.joinTo(user),
  pg: {
    text  : '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")',
    string: '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")'
  },
  sqlite: {
    text  : '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")',
    string: '"post" INNER JOIN "user" ON ("user"."id" = "post"."ownerId")'
  },
  mysql: {
    text  : '`post` INNER JOIN `user` ON (`user`.`id` = `post`.`ownerId`)',
    string: '`post` INNER JOIN `user` ON (`user`.`id` = `post`.`ownerId`)'
  },
  params: []
});

Harness.test({
  query: user.joinTo(photo),
  pg: {
    text  : '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")',
    string: '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")'
  },
  sqlite: {
    text  : '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")',
    string: '"user" INNER JOIN "photo" ON ("user"."id" = "photo"."ownerId")'
  },
  mysql: {
    text  : '`user` INNER JOIN `photo` ON (`user`.`id` = `photo`.`ownerId`)',
    string: '`user` INNER JOIN `photo` ON (`user`.`id` = `photo`.`ownerId`)'
  },
  params: []
});
