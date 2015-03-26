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

Harness.test({
  query: post.insert({
    content: post.sql.functions.LOWER('TEST'),
    userId: 2
  }),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (LOWER($1), $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (LOWER(\'TEST\'), 2)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (LOWER($1), $2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (LOWER(\'TEST\'), 2)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (LOWER(?), ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (LOWER(\'TEST\'), 2)'
  },
  params: ['TEST', 2]
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
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) VALUES (@1, @2), (@3, @4)',
    string: 'INSERT INTO [post] ([content], [userId]) VALUES (\'whoah\', 1), (\'hey\', 2)'
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
  mssql: {
    text  : 'INSERT INTO [post] DEFAULT VALUES',
    string: 'INSERT INTO [post] DEFAULT VALUES'
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
  mssql: {
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
  mssql: {
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
  mssql: {
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
  mssql: {
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
  mssql: {
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
  },
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) VALUES (@1, @2), (@3, DEFAULT)',
    string: 'INSERT INTO [post] ([content], [userId]) VALUES (\'whoah\', 1), (\'hey\', DEFAULT)',
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
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId], [content]) VALUES (@1, DEFAULT), (@2, @3)',
    string: 'INSERT INTO [post] ([userId], [content]) VALUES (1, DEFAULT), (2, \'hey\')',
    params: [1, 2, 'hey']
  }
});

Harness.test({
  query: post.insert(post.content, post.userId)
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE \'A%\')'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) SELECT \'test\', [user].[id] FROM [user] WHERE ([user].[name] LIKE @1)',
    string: 'INSERT INTO [post] ([content], [userId]) SELECT \'test\', [user].[id] FROM [user] WHERE ([user].[name] LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert([post.content, post.userId])
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE ?)',
    string: 'INSERT INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE \'A%\')'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) SELECT \'test\', [user].[id] FROM [user] WHERE ([user].[name] LIKE @1)',
    string: 'INSERT INTO [post] ([content], [userId]) SELECT \'test\', [user].[id] FROM [user] WHERE ([user].[name] LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.userId)
      .select(user.id).from(user).where(user.name.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user` WHERE (`user`.`name` LIKE ?)',
    string: 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user` WHERE (`user`.`name` LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.userId)
      .select(post.userId).from(user.join(post).on(user.id.equals(post.userId))).where(post.tags.like('A%')),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE \'A%\')'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE $1)',
    string: 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE \'A%\')'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `post`.`userId` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`) WHERE (`post`.`tags` LIKE ?)',
    string: 'INSERT INTO `post` (`userId`) SELECT `post`.`userId` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`) WHERE (`post`.`tags` LIKE \'A%\')'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT [post].[userId] FROM [user] INNER JOIN [post] ON ([user].[id] = [post].[userId]) WHERE ([post].[tags] LIKE @1)',
    string: 'INSERT INTO [post] ([userId]) SELECT [post].[userId] FROM [user] INNER JOIN [post] ON ([user].[id] = [post].[userId]) WHERE ([post].[tags] LIKE \'A%\')'
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
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) VALUES (@1, @2)',
    string: 'INSERT INTO [post] ([content], [userId]) VALUES (\'\\x74657374\', 2)'
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
  mssql: {
    text  : 'INSERT INTO [post] ([content], [userId]) VALUES (@1, @2)',
    string: 'INSERT INTO [post] ([content], [userId]) VALUES (\'\\x74657374\', 2)'
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
  mssql: {
    text  : 'INSERT INTO [post] ([content]) VALUES (@1), (@2)',
    string: 'INSERT INTO [post] ([content]) VALUES (\'\\x77686f6168\'), (\'\\x686579\')'
  },
  params: [new Buffer('whoah'), new Buffer('hey')]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onDuplicate({
    content: 'testupdate',
  }),
  pg: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  mysql: {
    text  : 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `post`.`content` = ?',
    string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'test\', 2) ON DUPLICATE KEY UPDATE `post`.`content` = \'testupdate\''
  },
  mssql: {
    throws: true
  },
  params: ['test', 2, 'testupdate']
});

Harness.test({
  query: post.insert([]),

  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (1=2)',
    string: 'SELECT `post`.* FROM `post` WHERE (1=2)'
  },
  params: []
});
