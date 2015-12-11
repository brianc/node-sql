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

Harness.test({
  query: post.select(Sql.functions.LEFT(post.content,4)),
  pg: {
    text  : 'SELECT LEFT("post"."content", $1) FROM "post"',
    string: 'SELECT LEFT("post"."content", 4) FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUBSTR("post"."content", 1, $1) FROM "post"',
    string: 'SELECT SUBSTR("post"."content", 1, 4) FROM "post"'
  },
  mysql: {
    text  : 'SELECT LEFT(`post`.`content`, ?) FROM `post`',
    string: 'SELECT LEFT(`post`.`content`, 4) FROM `post`'
  },
  mssql: {
    text  : 'SELECT LEFT([post].[content], @1) FROM [post]',
    string: 'SELECT LEFT([post].[content], 4) FROM [post]'
  },
  oracle: {
    text  : 'SELECT LEFT("post"."content", :1) FROM "post"',
    string: 'SELECT LEFT("post"."content", 4) FROM "post"'
  },
  params: [4]
});

Harness.test({
  query: post.select(Sql.functions.RIGHT(post.content,4)),
  pg: {
    text  : 'SELECT RIGHT("post"."content", $1) FROM "post"',
    string: 'SELECT RIGHT("post"."content", 4) FROM "post"'
  },
  sqlite: {
    text  : 'SELECT SUBSTR("post"."content", -$1) FROM "post"',
    string: 'SELECT SUBSTR("post"."content", -4) FROM "post"'
  },
  mysql: {
    text  : 'SELECT RIGHT(`post`.`content`, ?) FROM `post`',
    string: 'SELECT RIGHT(`post`.`content`, 4) FROM `post`'
  },
  mssql: {
    text  : 'SELECT RIGHT([post].[content], @1) FROM [post]',
    string: 'SELECT RIGHT([post].[content], 4) FROM [post]'
  },
  oracle: {
    text  : 'SELECT RIGHT("post"."content", :1) FROM "post"',
    string: 'SELECT RIGHT("post"."content", 4) FROM "post"'
  },
  params: [4]
});

