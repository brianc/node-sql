'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.truncate(),
  pg: {
    text  : 'TRUNCATE TABLE "post"',
    string: 'TRUNCATE TABLE "post"'
  },
  sqlite: {
    text  : 'DELETE FROM "post"',
    string: 'DELETE FROM "post"'
  },
  mysql: {
    text  : 'TRUNCATE TABLE `post`',
    string: 'TRUNCATE TABLE `post`'
  },
  mssql: {
    text  : 'TRUNCATE TABLE [post]',
    string: 'TRUNCATE TABLE [post]'
  },
  oracle: {
    text  : 'TRUNCATE TABLE "post"',
    string: 'TRUNCATE TABLE "post"'
  },
  params: []
});
