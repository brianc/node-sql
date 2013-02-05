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

//allow bulk insert
Harness.test({
  query : post.insert([{content: 'whoah'}, {content: 'hey'}]),
  pg    : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
  params: ['whoah', 'hey']
});

Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {content: 'hey', userId: 2}]),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
  params: ['whoah', 1, 'hey', 2]
});


//consistent order
Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {userId: 2, content: 'hey' }]),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
  params: ['whoah', 1, 'hey', 2]
});


//handle missing columns
Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {content: 'hey'}]),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
  params: ['whoah', 1, 'hey', 'DEFAULT']
});

Harness.test({
  query : post.insert([{userId: 1}, {content: 'hey', userId: 2}]),
  pg    : 'INSERT INTO "post" ("userId", "content") VALUES ($1, $2), ($3, $4)',
  params: [1, 'DEFAULT', 2, 'hey']
});


