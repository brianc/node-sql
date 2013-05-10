'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

Harness.test({
  query : user.select(user.star()).from(user).from(post),
  pg    : 'SELECT "user".* FROM "user" , "post"',
  sqlite: 'SELECT "user".* FROM "user" , "post"',
  mysql : 'SELECT `user`.* FROM `user` , `post`'
});
