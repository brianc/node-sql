var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.insert(post.content.value('test'), post.userId.value(1)),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
  params: ['test', 1]
});

Harness.test({
  query : post.insert(post.content.value('whoah')),
  pg    : 'INSERT INTO "post" ("content") VALUES ($1)',
  params: ['whoah']
});

Harness.test({
  query : post.insert({content: 'test', userId: 2}),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
  params: ['test', 2]
});
