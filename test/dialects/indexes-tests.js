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
  query:    post.indexes().create('index_name').unique().using('btree').onColumns(post.id, post.userId).withParser('foo'),
  pg:       "CREATE UNIQUE INDEX \"index_name\" USING BTREE ON \"post\" (\"post\".\"id\",\"post\".\"userId\") WITH PARSER foo",
  my2sql:    "CREATE UNIQUE INDEX `index_name` USING BTREE ON `post` (`post`.`id`,`post`.`userId`) WITH PARSER foo"
});
