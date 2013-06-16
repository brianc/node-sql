'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();

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
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING *',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING *'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES () RETURNING *',
    string: 'INSERT INTO `post` () VALUES () RETURNING *'
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
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING *',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING *'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES () RETURNING *',
    string: 'INSERT INTO `post` () VALUES () RETURNING *'
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
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id"'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES () RETURNING `id`',
    string: 'INSERT INTO `post` () VALUES () RETURNING `id`'
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
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES () RETURNING `id`, `content`',
    string: 'INSERT INTO `post` () VALUES () RETURNING `id`, `content`'
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
    text  : 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"',
    string: 'INSERT INTO "post" DEFAULT VALUES RETURNING "id", "content"'
  },
  mysql: {
    text  : 'INSERT INTO `post` () VALUES () RETURNING `id`, `content`',
    string: 'INSERT INTO `post` () VALUES () RETURNING `id`, `content`'
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
