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
  mssql: {
    text  : 'DROP TABLE [post]',
    string: 'DROP TABLE [post]'
  },
  oracle: {
    text  : 'DROP TABLE "post"',
    string: 'DROP TABLE "post"'
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
  mssql: {
    text  : 'IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [post]) BEGIN DROP TABLE [post] END',
    string: 'IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = [post]) BEGIN DROP TABLE [post] END'
  },
  oracle: {
    text  : 'BEGIN EXECUTE IMMEDIATE \'DROP TABLE "post"\'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF; END;',
    string: 'BEGIN EXECUTE IMMEDIATE \'DROP TABLE "post"\'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -942 THEN RAISE; END IF; END;'
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
  oracle: {
    text  : 'DROP TABLE "post" CASCADE CONSTRAINTS',
    string: 'DROP TABLE "post" CASCADE CONSTRAINTS'
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
  oracle: {
    text  : 'Oracle do not support RESTRICT in DROP TABLE',
    throws: true
  },
  params: []
});
