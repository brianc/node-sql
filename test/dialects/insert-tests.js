'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

Harness.test({
  query : post.insert(post.content.value('test'), post.userId.value(1)),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
  mysql : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
  params: ['test', 1]
});


Harness.test({
  query : post.insert(post.content.value('whoah')),
  pg    : 'INSERT INTO "post" ("content") VALUES ($1)',
  mysql : 'INSERT INTO `post` (`content`) VALUES (?)',
  params: ['whoah']
});

Harness.test({
  query : post.insert({content: 'test', userId: 2}),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
  mysql : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
  params: ['test', 2]
});

//allow bulk insert
Harness.test({
  query : post.insert([{content: 'whoah'}, {content: 'hey'}]),
  pg    : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
  mysql : 'INSERT INTO `post` (`content`) VALUES (?), (?)',
  params: ['whoah', 'hey']
});

Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {content: 'hey', userId: 2}]),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
  mysql : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, ?)',
  params: ['whoah', 1, 'hey', 2]
});


//consistent order
Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {userId: 2, content: 'hey' }]),
  pg    : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
  mysql : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, ?)',
  params: ['whoah', 1, 'hey', 2]
});


//handle missing columns
Harness.test({
  query : post.insert([{content: 'whoah', userId: 1}, {content: 'hey'}]),
  pg    : {
    text: 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    params: ['whoah', 1, 'hey', 'DEFAULT']
  },
  mysql : {
    text: 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, DEFAULT)',
    params: ['whoah', 1, 'hey']
  }
});

Harness.test({
  query : post.insert([{userId: 1}, {content: 'hey', userId: 2}]),
  pg    : {
    text: 'INSERT INTO "post" ("userId", "content") VALUES ($1, $2), ($3, $4)',
    params: [1, 'DEFAULT', 2, 'hey']
  },
  mysql : {
    text: 'INSERT INTO `post` (`userId`, `content`) VALUES (?, DEFAULT), (?, ?)',
    params: [1, 2, 'hey']
  }
});

Harness.test({
  query : post.insert({}),
  pg    : {
    text: 'INSERT INTO "post" DEFAULT VALUES',
    params: []
  },
  mysql : {
    text: 'INSERT INTO `post` () VALUES ()',
    params: []
  }
});


