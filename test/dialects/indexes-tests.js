'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query:  post.indexes(),
  pg:     "SELECT relname FROM pg_class WHERE oid IN ( SELECT indexrelid FROM pg_index, pg_class WHERE pg_class.relname=\"post\" AND pg_class.oid=pg_index.indrelid)",
  mysql:  "SHOW INDEX FROM `post`",
  sqlite: "PRAGMA INDEX_LIST(\"post\")"
});

Harness.test({
  query:  post.indexes().create('index_name').unique().using('btree').on(post.id, post.userId).withParser('foo'),
  pg:     "CREATE UNIQUE INDEX \"index_name\" USING BTREE ON \"post\" (\"id\",\"userId\") WITH PARSER foo",
  mysql:  "CREATE UNIQUE INDEX `index_name` USING BTREE ON `post` (`id`,`userId`) WITH PARSER foo",
  sqlite: "CREATE UNIQUE INDEX \"index_name\" USING BTREE ON \"post\" (\"id\",\"userId\") WITH PARSER foo"
});

Harness.test({
  query:  post.indexes().create().fulltext().on(post.id),
  pg:     "CREATE FULLTEXT INDEX \"post_id\" ON \"post\" (\"id\")",
  mysql:  "CREATE FULLTEXT INDEX `post_id` ON `post` (`id`)",
  sqlite: "CREATE FULLTEXT INDEX \"post_id\" ON \"post\" (\"id\")"
});

Harness.test({
  query:  post.indexes().create().spatial().on(post.id),
  pg:     "CREATE SPATIAL INDEX \"post_id\" ON \"post\" (\"id\")",
  mysql:  "CREATE SPATIAL INDEX `post_id` ON `post` (`id`)",
  sqlite: "CREATE SPATIAL INDEX \"post_id\" ON \"post\" (\"id\")"
});

Harness.test({
  query:  post.indexes().create().ifNotExists().on(post.id),
  pg:     "CREATE INDEX IF NOT EXISTS \"post_id\" ON \"post\" (\"id\")",
  mysql:  "CREATE INDEX IF NOT EXISTS `post_id` ON `post` (`id`)",
  sqlite: "CREATE INDEX IF NOT EXISTS \"post_id\" ON \"post\" (\"id\")"
});

Harness.test({
  query:  post.indexes().create().on(post.userId, post.id),
  pg:     "CREATE INDEX \"post_id_userId\" ON \"post\" (\"userId\",\"id\")",
  mysql:  "CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)",
  sqlite: "CREATE INDEX \"post_id_userId\" ON \"post\" (\"userId\",\"id\")"
});

Harness.test({
  query:  post.indexes().create().on(post.userId).on(post.id),
  pg:     "CREATE INDEX \"post_id_userId\" ON \"post\" (\"userId\",\"id\")",
  mysql:  "CREATE INDEX `post_id_userId` ON `post` (`userId`,`id`)",
  sqlite: "CREATE INDEX \"post_id_userId\" ON \"post\" (\"userId\",\"id\")"
});

Harness.test({
  query:  post.indexes().create(),
  pg:     { text: 'No columns defined!', throws: true },
  mysql:  { text: 'No columns defined!', throws: true },
  sqlite: { text: 'No columns defined!', throws: true }
});

Harness.test({
  query:  post.indexes().drop('index_name'),
  pg:     "DROP INDEX \"index_name\" ON \"post\"",
  mysql:  "DROP INDEX `index_name` ON `post`",
  sqlite: "DROP INDEX \"index_name\" ON \"post\""
});

Harness.test({
  query:  post.indexes().drop('index_name').ifExists(),
  pg:     "DROP INDEX IF EXISTS \"index_name\" ON \"post\"",
  mysql:  "DROP INDEX IF EXISTS `index_name` ON `post`",
  sqlite: "DROP INDEX IF EXISTS \"index_name\" ON \"post\""
});

Harness.test({
  query:  post.indexes().drop(post.userId, post.id),
  pg:     "DROP INDEX \"post_id_userId\" ON \"post\"",
  mysql:  "DROP INDEX `post_id_userId` ON `post`",
  sqlite: "DROP INDEX \"post_id_userId\" ON \"post\""
});
