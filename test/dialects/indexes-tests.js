'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.indexes(),
  pg: {
    text  : 'SELECT relname FROM pg_class WHERE oid IN ( SELECT indexrelid FROM pg_index, pg_class WHERE pg_class.relname=\'post\' AND pg_class.relnamespace IN (SELECT pg_namespace.oid FROM pg_namespace WHERE nspname = \'public\') AND pg_class.oid=pg_index.indrelid)',
    string: 'SELECT relname FROM pg_class WHERE oid IN ( SELECT indexrelid FROM pg_index, pg_class WHERE pg_class.relname=\'post\' AND pg_class.relnamespace IN (SELECT pg_namespace.oid FROM pg_namespace WHERE nspname = \'public\') AND pg_class.oid=pg_index.indrelid)'
  },
  mysql: {
    text  : 'SHOW INDEX FROM `post`',
    string: 'SHOW INDEX FROM `post`'
  },
  sqlite: {
    text  : 'PRAGMA INDEX_LIST("post")',
    string: 'PRAGMA INDEX_LIST("post")'
  },
  oracle: {
    text  : 'SELECT * FROM USER_INDEXES WHERE TABLE_NAME = \'post\'',
    string: 'SELECT * FROM USER_INDEXES WHERE TABLE_NAME = \'post\''
  },
  params: []
});

Harness.test({
  query: post.indexes().create('index_name').unique().using('btree').on(post.id, post.userId).withParser('foo'),
  pg: {
    text  : 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo',
    string: 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo'
  },
  mysql: {
    text  : 'CREATE UNIQUE INDEX `index_name` USING BTREE ON `post` (`id`,`userId`) WITH PARSER foo',
    string: 'CREATE UNIQUE INDEX `index_name` USING BTREE ON `post` (`id`,`userId`) WITH PARSER foo'
  },
  sqlite: {
    text  : 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo',
    string: 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo'
  },
  oracle: {
    text  : 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo',
    string: 'CREATE UNIQUE INDEX "index_name" USING BTREE ON "post" ("id","userId") WITH PARSER foo'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().fulltext().on(post.id),
  pg: {
    text  : 'CREATE FULLTEXT INDEX "post_id" ON "post" ("id")',
    string: 'CREATE FULLTEXT INDEX "post_id" ON "post" ("id")'
  },
  mysql: {
    text  : 'CREATE FULLTEXT INDEX `post_id` ON `post` (`id`)',
    string: 'CREATE FULLTEXT INDEX `post_id` ON `post` (`id`)'
  },
  sqlite: {
    text  : 'CREATE FULLTEXT INDEX "post_id" ON "post" ("id")',
    string: 'CREATE FULLTEXT INDEX "post_id" ON "post" ("id")'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().spatial().on(post.id),
  pg: {
    text  : 'CREATE SPATIAL INDEX "post_id" ON "post" ("id")',
    string: 'CREATE SPATIAL INDEX "post_id" ON "post" ("id")'
  },
  mysql: {
    text  : 'CREATE SPATIAL INDEX `post_id` ON `post` (`id`)',
    string: 'CREATE SPATIAL INDEX `post_id` ON `post` (`id`)'
  },
  sqlite: {
    text  : 'CREATE SPATIAL INDEX "post_id" ON "post" ("id")',
    string: 'CREATE SPATIAL INDEX "post_id" ON "post" ("id")'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().on(post.userId, post.id),
  pg: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  mysql: {
    text  : 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)',
    string: 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)'
  },
  sqlite: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  oracle: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().on(post.userId).on(post.id),
  pg: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  mysql: {
    text  : 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)',
    string: 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)'
  },
  sqlite: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  oracle: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id")'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().on(post.userId, post.id.desc),
  pg: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  mysql: {
    text  : 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id` DESC)',
    string: 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id` DESC)'
  },
  sqlite: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  mssql: {
    text  : 'CREATE INDEX [post_id_userId] ON [post] ([userId],[id] DESC)',
    string: 'CREATE INDEX [post_id_userId] ON [post] ([userId],[id] DESC)'
  },
  oracle: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  params: []
});

Harness.test({
  query: post.indexes().create().on(post.userId).on(post.id.descending),
  pg: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  mysql: {
    text  : 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id` DESC)',
    string: 'CREATE INDEX `post_id_userId` ON `post` (`userId`,`id` DESC)'
  },
  sqlite: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  mssql: {
    text  : 'CREATE INDEX [post_id_userId] ON [post] ([userId],[id] DESC)',
    string: 'CREATE INDEX [post_id_userId] ON [post] ([userId],[id] DESC)'
  },
  oracle: {
    text  : 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)',
    string: 'CREATE INDEX "post_id_userId" ON "post" ("userId","id" DESC)'
  },
  params: []
});


Harness.test({
  query: post.indexes().create(),
  pg: {
    text  : 'No columns defined!',
    throws: true
  },
  mysql: {
    text  : 'No columns defined!',
    throws: true
  },
  sqlite: {
    text  : 'No columns defined!',
    throws: true
  },
  oracle: {
    text  : 'No columns defined!',
    throws: true
  }
});

Harness.test({
  query: post.indexes().drop('index_name'),
  pg: {
    text  : 'DROP INDEX "public"."index_name"',
    string: 'DROP INDEX "public"."index_name"'
  },
  mysql: {
    text  : 'DROP INDEX `public`.`index_name`',
    string: 'DROP INDEX `public`.`index_name`'
  },
  sqlite: {
    text  : 'DROP INDEX "public"."index_name"',
    string: 'DROP INDEX "public"."index_name"'
  },
  oracle: {
    text  : 'DROP INDEX "index_name"',
    string: 'DROP INDEX "index_name"'
  },
  params: []
});

Harness.test({
  query: post.indexes().drop(post.userId, post.id),
  pg: {
    text  : 'DROP INDEX "public"."post_id_userId"',
    string: 'DROP INDEX "public"."post_id_userId"'
  },
  mysql: {
    text  : 'DROP INDEX `public`.`post_id_userId`',
    string: 'DROP INDEX `public`.`post_id_userId`'
  },
  sqlite: {
    text  : 'DROP INDEX "public"."post_id_userId"',
    string: 'DROP INDEX "public"."post_id_userId"'
  },
  oracle: {
    text  : 'DROP INDEX "post_id_userId"',
    string: 'DROP INDEX "post_id_userId"'
  },
  params: []
});
