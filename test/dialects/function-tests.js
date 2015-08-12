'use strict';

var Harness = require('./support');
var Sql = require('../../lib');

var post = Harness.definePostTable();

Harness.test({
  query: post.select(Sql.functions.LENGTH(post.content)),
  pg: {
    text  : 'SELECT LENGTH("post"."content") FROM "post"',
    string: 'SELECT LENGTH("post"."content") FROM "post"'
  },
  sqlite: {
    text  : 'SELECT LENGTH("post"."content") FROM "post"',
    string: 'SELECT LENGTH("post"."content") FROM "post"'
  },
  mysql: {
    text  : 'SELECT LENGTH(`post`.`content`) FROM `post`',
    string: 'SELECT LENGTH(`post`.`content`) FROM `post`'
  },
  mssql: {
    text  : 'SELECT LEN([post].[content]) FROM [post]',
    string: 'SELECT LEN([post].[content]) FROM [post]'
  },
  oracle: {
    text  : 'SELECT LENGTH("post"."content") FROM "post"',
    string: 'SELECT LENGTH("post"."content") FROM "post"'
  },
  params: []
});

