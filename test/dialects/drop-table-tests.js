'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query: post.drop(),
  pg: {
    text  : 'DROP TABLE "post"',
    string: 'DROP TABLE "post"'
  },
  sqlite: {
    text  : 'DROP TABLE "post"',
    string: 'DROP TABLE "post"'
  },
  mysql: {
    text  : 'DROP TABLE `post`',
    string: 'DROP TABLE `post`'
  },
  params: []
});

Harness.test({
  query: post.drop().ifExists(),
  pg: {
    text  : 'DROP TABLE IF EXISTS "post"',
    string: 'DROP TABLE IF EXISTS "post"'
  },
  sqlite: {
    text  : 'DROP TABLE IF EXISTS "post"',
    string: 'DROP TABLE IF EXISTS "post"'
  },
  mysql: {
    text  : 'DROP TABLE IF EXISTS `post`',
    string: 'DROP TABLE IF EXISTS `post`'
  },
  params: []
});
