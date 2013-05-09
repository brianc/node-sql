'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post['delete']().where(post.content.equals('')),
  pg    : 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  sqlite: 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  mysql : 'DELETE `post` FROM `post` WHERE (`post`.`content` = ?)',
  params: ['']
});

Harness.test({
  query : post['delete']().where({content: ''}),
  pg    : 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  sqlite: 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  mysql : 'DELETE `post` FROM `post` WHERE (`post`.`content` = ?)',
  params: ['']
});

Harness.test({
  query : post['delete']({content: ''}),
  pg    : 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  sqlite: 'DELETE "post" FROM "post" WHERE ("post"."content" = $1)',
  mysql : 'DELETE `post` FROM `post` WHERE (`post`.`content` = ?)',
  params: ['']
});

Harness.test({
  query : post['delete']({content: ''}).or(post.content.isNull()),
  pg    : 'DELETE "post" FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
  sqlite: 'DELETE "post" FROM "post" WHERE (("post"."content" = $1) OR ("post"."content" IS NULL))',
  mysql : 'DELETE `post` FROM `post` WHERE ((`post`.`content` = ?) OR (`post`.`content` IS NULL))',
  params: ['']
});
