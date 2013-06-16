'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

Harness.test({
  query: user.select(user.star()).from(user).from(post),
  pg: {
    text  : 'SELECT "user".* FROM "user" , "post"',
    string: 'SELECT "user".* FROM "user" , "post"'
  },
  sqlite: {
    text  : 'SELECT "user".* FROM "user" , "post"',
    string: 'SELECT "user".* FROM "user" , "post"'
  },
  mysql: {
    text  : 'SELECT `user`.* FROM `user` , `post`',
    string: 'SELECT `user`.* FROM `user` , `post`'
  }
});
