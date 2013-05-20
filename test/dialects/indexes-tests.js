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
  query: post.indexes().create({
    type:      'unique',
    algorithm: 'btree',
    parser:    'foo',
    name:      'bar',
    columns:   [post.id, post.userId]
  }),
  mysql: "CREATE UNIQUE INDEX `bar` USING BTREE ON `post` (`post`.`id`, `post`.`userId`) WITH PARSER foo"
})
