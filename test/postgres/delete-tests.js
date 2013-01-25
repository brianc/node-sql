var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.delete().where(post.content.equals('')),
  pg    : 'DELETE FROM "post" WHERE ("post"."content" = $1)',
  params: ['']
});
