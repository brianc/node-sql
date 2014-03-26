'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var bar = Harness.definePostTable();

Harness.test({
  query: post.select(post.star()).forUpdate(),
  pg: {
    text  : 'SELECT "post".* FROM "post" FOR UPDATE',
    string: 'SELECT "post".* FROM "post" FOR UPDATE'
  },
  mysql: {
    text  : 'SELECT `post`.* FROM `post` FOR UPDATE',
    string: 'SELECT `post`.* FROM `post` FOR UPDATE'
  },
  params: []
});
