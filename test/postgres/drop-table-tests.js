var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.drop(),
  pg    : 'DROP TABLE "post"',
  params: []
});

Harness.test({
  query : post.drop().ifExists(),
  pg    : 'DROP TABLE IF EXISTS "post"',
  params: []
});