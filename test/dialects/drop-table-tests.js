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

Harness.test({
  query: post.drop().cascade(),
  pg: {
    text  : 'DROP TABLE "post" CASCADE',
    string: 'DROP TABLE "post" CASCADE'
  },
  sqlite: {
    text  : 'Sqlite do not support CASCADE in DROP TABLE',
    throws: true
  },
  mysql: {
    text  : 'DROP TABLE `post` CASCADE',
    string: 'DROP TABLE `post` CASCADE'
  },
  params: []
});

Harness.test({
  query: post.drop().restrict(),
  pg: {
    text  : 'DROP TABLE "post" RESTRICT',
    string: 'DROP TABLE "post" RESTRICT'
  },
  sqlite: {
    text  : 'Sqlite do not support RESTRICT in DROP TABLE',
    throws: true
  },
  mysql: {
    text  : 'DROP TABLE `post` RESTRICT',
    string: 'DROP TABLE `post` RESTRICT'
  },
  params: []
});
