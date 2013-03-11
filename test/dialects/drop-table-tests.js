'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.drop(),
  pg    : 'DROP TABLE "post"',
  sqlite: 'DROP TABLE "post"',
  mysql : 'DROP TABLE `post`',
  params: []
});

Harness.test({
  query : post.drop().ifExists(),
  pg    : 'DROP TABLE IF EXISTS "post"',
  sqlite: 'DROP TABLE IF EXISTS "post"',
  mysql : 'DROP TABLE IF EXISTS `post`',
  params: []
});