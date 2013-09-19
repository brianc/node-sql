'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();

Harness.test({
  query: post.insert(post.content.value('test'), post.userId.value(1)),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 1)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 1)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'test\', 1)'
  },
  params: ['test', 1]
});

Harness.test({
  query: post.insert(post.content.value('whoah')),
  pg: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`) VALUES (?)',
    string: 'INSERT INTO `post` (`content`) VALUES (\'whoah\')'
  },
  params: ['whoah']
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'test\', 2)'
  },
  params: ['test', 2]
});

// allow bulk insert
Harness.test({
  query: post.insert([{
      content: 'whoah'
    }, {
      content: 'hey'
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\'), (\'hey\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\'), (\'hey\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`) VALUES (?), (?)',
    string: 'INSERT INTO `post` (`content`) VALUES (\'whoah\'), (\'hey\')'
  },
  params: ['whoah', 'hey']
});

Harness.test({
  query: post.insert([{
      content: 'whoah',
      userId: 1
    }, {
      content: 'hey',
      userId: 2
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  params: ['whoah', 1, 'hey', 2]
});

// consistent order
Harness.test({
  query: post.insert([{
      content: 'whoah',
      userId: 1
    }, {
      userId: 2,
      content: 'hey'
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  params: ['whoah', 1, 'hey', 2]
});

Harness.test({
  query: post.insert({}),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES',
    string: 'INSERT INTO "post" DEFAULT VALUES'
  },
  sqlite: {
    text  : 'INSERT INTO "post" DEFAULT VALUES',
    string: 'INSERT INTO "post" DEFAULT VALUES'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES ()',
    string: 'INSERT INTO `post` () VALUES ()'
  },
  params: []
});

Harness.test({
  query: post.insert({}).returning('*'),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING *',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING *'
  },
  sqlite: {
    throws: true
  },
  mysql: {
    throws: true
  },
  params: []
});

Harness.test({
  query: post.insert({}).returning(post.star()),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING *',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING *'
  },
  sqlite: {
    throws: true
  },
  mysql: {
    throws: true
  },
  params: []
});

Harness.test({
  query: post.insert({}).returning(post.id),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id"'
  },
  sqlite: {
    throws: true
  },
  mysql: {
    throws: true
  },
  params: []
});

Harness.test({
  query: post.insert({}).returning(post.id, post.content),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"'
  },
  sqlite: {
    throws: true
  },
  mysql: {
    throws: true
  },
  params: []
});

Harness.test({
  query: post.insert({}).returning([post.id, post.content]),
  pg: {
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"'
  },
  sqlite: {
    throws: true
  },
  mysql: {
    throws: true
  },
  params: []
});

// handle missing columns
Harness.test({
  query: post.insert([{
      content: 'whoah',
      userId: 1
    }, {
      content: 'hey'
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2), ($3, DEFAULT)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', DEFAULT)',
    params: ['whoah', 1, 'hey']
  },
  sqlite: {
    text  : 'Sqlite requires the same number of columns in each insert row',
    throws: true
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?), (?, DEFAULT)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'whoah\', 1), (\'hey\', DEFAULT)',
    params: ['whoah', 1, 'hey']
  }
});

Harness.test({
  query: post.insert([{
      userId: 1
    }, {
      content: 'hey',
      userId: 2
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("userId", "content") VALUES ($1, DEFAULT), ($2, $3)',
    string: 'INSERT INTO "post" ("userId", "content") VALUES (1, DEFAULT), (2, \'hey\')',
    params: [1, 2, 'hey']
  },
  sqlite: {
    text  : 'Sqlite requires the same number of columns in each insert row',
    throws: true
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`, `content`) VALUES (?, DEFAULT), (?, ?)',
    string: 'INSERT INTO `post` (`userId`, `content`) VALUES (1, DEFAULT), (2, \'hey\')',
    params: [1, 2, 'hey']
  }
});

Harness.test({
  query: post.insert(post.content, post.userId)
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `id` FROM `user` WHERE (`name` LIKE ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `id` FROM `user` WHERE (`name` LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert([post.content, post.userId])
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `id` FROM `user` WHERE (`name` LIKE ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `id` FROM `user` WHERE (`name` LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.userId)
      .select(user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "id" FROM "user" WHERE ("name" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "id" FROM "user" WHERE ("name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `id` FROM `user` WHERE (`name` LIKE ?)',
    string: 'INSERT INTO `post` (`userId`) SELECT `id` FROM `user` WHERE (`name` LIKE \'A%\')'
  },
  params: ['A%']
});

// Binary inserts
Harness.test({
  query: post.insert(post.content.value(new Buffer('test')), post.userId.value(2)),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'\\x74657374\', 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (x\'74657374\', 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (x\'74657374\', 2)'
  },
  params: [new Buffer('test'), 2]
});

Harness.test({
  query: post.insert({
    content: new Buffer('test'),
    userId: 2
  }),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'\\x74657374\', 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (x\'74657374\', 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (x\'74657374\', 2)'
  },
  params: [new Buffer('test'), 2]
});

Harness.test({
  query: post.insert([{
      content: new Buffer('whoah')
    }, {
      content: new Buffer('hey')
    }
  ]),
  pg: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
    string: 'INSERT INTO "post" ("content") ' + 
            'VALUES (\'\\x77686f6168\'), (\'\\x686579\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content") VALUES ($1), ($2)',
    string: 'INSERT INTO "post" ("content") VALUES (x\'77686f6168\'), (x\'686579\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`) VALUES (?), (?)',
    string: 'INSERT INTO `post` (`content`) VALUES (x\'77686f6168\'), (x\'686579\')'
  },
  params: [new Buffer('whoah'), new Buffer('hey')]
});
