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
  sqlserver: {
    text  : 'DROP TABLE [post]',
    string: 'DROP TABLE [post]'
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
  sqlserver: {
    text  : 'IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [post]) BEGIN DROP TABLE [post] END',
    string: 'IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [post]) BEGIN DROP TABLE [post] END'
  },
  params: []
});
