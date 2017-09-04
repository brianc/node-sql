'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();
var contentTable = Harness.defineContentTable();
var customerAliasTable = Harness.defineCustomerAliasTable();

var arrayTable = require('../../lib/table').define({
    name: 'arraytest',
    columns: ['id', 'numbers']
});

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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 1)'
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
  mssql: {
    text  : 'INSERT INTO [post] ([content]) VALUES (@1)',
    string: 'INSERT INTO [post] ([content]) VALUES (\'whoah\')'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("content") VALUES (:1)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\')'
  },
  params: ['whoah']
});

Harness.test({
  query: post.insert({length: 0}),
  pg: {
    text  : 'INSERT INTO "post" ("length") VALUES ($1)',
    string: 'INSERT INTO "post" ("length") VALUES (0)'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("length") VALUES ($1)',
    string: 'INSERT INTO "post" ("length") VALUES (0)'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`length`) VALUES (?)',
    string: 'INSERT INTO `post` (`length`) VALUES (0)'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([length]) VALUES (@1)',
    string: 'INSERT INTO [post] ([length]) VALUES (0)'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("length") VALUES (:1)',
    string: 'INSERT INTO "post" ("length") VALUES (0)'
  },
  params: [0]
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (LOWER(:1), :2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (LOWER(\'TEST\'), 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content") VALUES (:1), (:2)',
    string: 'INSERT INTO "post" ("content") VALUES (\'whoah\'), (\'hey\')'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2), (:3, :4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2), (:3, :4)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" DEFAULT VALUES',
    string: 'INSERT INTO "post" DEFAULT VALUES'
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
  oracle: {
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
  oracle: {
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
  oracle: {
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
  oracle: {
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
  oracle: {
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
  },
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2), (:3, DEFAULT)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', DEFAULT)',
    params: ['whoah', 1, 'hey']
  },
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
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId", "content") VALUES (:1, DEFAULT), (:2, :3)',
    string: 'INSERT INTO "post" ("userId", "content") VALUES (1, DEFAULT), (2, \'hey\')',
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE :1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE :1)',
    string: 'INSERT INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
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
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE :1)',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
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
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE :1)',
    string: 'INSERT INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE \'A%\')'
  },
  params: ['A%']
});

Harness.test({
  query: post.insert(post.userId).select(user.id).distinct().from(user),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT DISTINCT `user`.`id` FROM `user`',
    string: 'INSERT INTO `post` (`userId`) SELECT DISTINCT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT DISTINCT [user].[id] FROM [user]',
    string: 'INSERT INTO [post] ([userId]) SELECT DISTINCT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"'
  },
  params: []
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (utl_raw.cast_to_varchar2(hextoraw(\'74657374\')), 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES (:1, :2)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (utl_raw.cast_to_varchar2(hextoraw(\'74657374\')), 2)'
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
  oracle: {
    text  : 'INSERT INTO "post" ("content") VALUES (:1), (:2)',
    string: 'INSERT INTO "post" ("content") VALUES (utl_raw.cast_to_varchar2(hextoraw(\'77686f6168\'))), (utl_raw.cast_to_varchar2(hextoraw(\'686579\')))'
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
  oracle: {
    throws: true
  },
  params: ['test', 2, 'testupdate']
});

Harness.test({
  query: customerAliasTable.insert({
    id : 2,
    name : 'test'
  }).onConflict({
    columns: ['id'],
    update: ['name']
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "customer" ("id", "name") VALUES ($1, $2) ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"',
    string: 'INSERT INTO "customer" ("id", "name") VALUES (2, \'test\') ON CONFLICT ("id") DO UPDATE SET "name" = EXCLUDED."name"'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [2, 'test']
});

Harness.test({
  query: customerAliasTable.insert({
    id : 2,
    name : 'test'
  }).orIgnore(),
  mysql: {
    throws: true
  },
  sqlite: {
    text  : 'INSERT OR IGNORE INTO "customer" ("id", "name") VALUES ($1, $2)',
    string: 'INSERT OR IGNORE INTO "customer" ("id", "name") VALUES (2, \'test\')'
  },
  pg: {
    throws: true
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [2, 'test']
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    columns: ['userId'],
    update: ['content']
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content"',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content"'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    columns: ['userId','content'],
    update: ['content','userId']
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ("userId", "content") DO UPDATE SET "content" = EXCLUDED."content", "userId" = EXCLUDED."userId"',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ("userId", "content") DO UPDATE SET "content" = EXCLUDED."content", "userId" = EXCLUDED."userId"'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    columns: ['userId'],
    update: ['content']
  }).where(post.userId.equals(2)),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content" WHERE ("post"."userId" = $3)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content" WHERE ("post"."userId" = 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2, 2]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    constraint: 'conc_userId',
    update: ['content']
  }).where(post.userId.equals(2)),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ON CONSTRAINT "conc_userId" DO UPDATE SET "content" = EXCLUDED."content" WHERE ("post"."userId" = $3)',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ON CONSTRAINT "conc_userId" DO UPDATE SET "content" = EXCLUDED."content" WHERE ("post"."userId" = 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2, 2]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    columns: ['userId'],
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ("userId") DO NOTHING',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ("userId") DO NOTHING'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2]
});

Harness.test({
  query: post.insert({
    content: 'test',
    userId: 2
  }).onConflict({
    constraint: 'conc_userId',
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "post" ("content", "userId") VALUES ($1, $2) ON CONFLICT ON CONSTRAINT "conc_userId" DO NOTHING',
    string: 'INSERT INTO "post" ("content", "userId") VALUES (\'test\', 2) ON CONFLICT ON CONSTRAINT "conc_userId" DO NOTHING'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 2]
});

Harness.test({
  query: contentTable.insert({
    contentId: 20,
    text : "something" 
  }).onConflict({
    columns: ['contentId'],
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "content" ("content_id", "text") VALUES ($1, $2) ON CONFLICT ("content_id") DO NOTHING',
    string: 'INSERT INTO "content" ("content_id", "text") VALUES (20, \'something\') ON CONFLICT ("content_id") DO NOTHING'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [20, "something"]
});

Harness.test({
  query: contentTable.insert({
    contentId: 20,
    text : "something",
    contentPosts : "another thing",
  }).onConflict({
    columns: ['contentId'],
    update: ['contentPosts']
  }),
  mysql: {
    throws: true
  },
  sqlite: {
    throws: true
  },
  pg: {
    text  : 'INSERT INTO "content" ("content_id", "text", "content_posts") VALUES ($1, $2, $3) ON CONFLICT ("content_id") DO UPDATE SET "content_posts" = EXCLUDED."content_posts"',
    string: 'INSERT INTO "content" ("content_id", "text", "content_posts") VALUES (20, \'something\', \'another thing\') ON CONFLICT ("content_id") DO UPDATE SET "content_posts" = EXCLUDED."content_posts"'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [20, "something", "another thing"]
});

Harness.test({
  query: post.insert([]),

  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (1=2)',
    string: 'SELECT `post`.* FROM `post` WHERE (1=2)'
  },
  params: []
});

Harness.test({
  query: arrayTable.insert(arrayTable.id.value(1), arrayTable.numbers.value([2, 3, 4])),
  pg: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, \'{2,3,4}\')'
  },
  sqlite: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, \'[2,3,4]\')'
  },
  mysql: {
    text  : 'INSERT INTO `arraytest` (`id`, `numbers`) VALUES (?, ?)',
    string: 'INSERT INTO `arraytest` (`id`, `numbers`) VALUES (1, (2, 3, 4))'
  },
  oracle: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES (:1, :2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, (2, 3, 4))'
  }
});

Harness.test({
  query: arrayTable.insert(arrayTable.id.value(1), arrayTable.numbers.value(["one", "two", "three"])),
  pg: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, \'{"one","two","three"}\')'
  },
  sqlite: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, \'["one","two","three"]\')'
  },
  mysql: {
    text  : 'INSERT INTO `arraytest` (`id`, `numbers`) VALUES (?, ?)',
    string: 'INSERT INTO `arraytest` (`id`, `numbers`) VALUES (1, (\'one\', \'two\', \'three\'))'
  },
  oracle: {
    text  : 'INSERT INTO "arraytest" ("id", "numbers") VALUES (:1, :2)',
    string: 'INSERT INTO "arraytest" ("id", "numbers") VALUES (1, (\'one\', \'two\', \'three\'))'
  }
});

Harness.test({
  query: post.insert(post.userId).select(user.id).from(user),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]',
    string: 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: post.insert(post.userId).select(user.id).from(user).onConflict({
    columns: ['userId'],
    update: ['content']
  }),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ON CONFLICT ("userId") DO UPDATE SET "content" = EXCLUDED."content"'
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
  oracle: {
    throws: true
  },
  params: []
});

Harness.test({
  query: post.insert(post.userId).add(user.select(user.id)),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]',
    string: 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: post.insert(post.userId).add(user.select(user.id).from(user)),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]',
    string: 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user]'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  params: []
});

Harness.test({
  query: post.insert(post.userId).add(user.select(user.id).order(user.id)),
  pg: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"'
  },
  sqlite: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"'
  },
  mysql: {
    text  : 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user` ORDER BY `user`.`id`',
    string: 'INSERT INTO `post` (`userId`) SELECT `user`.`id` FROM `user` ORDER BY `user`.`id`'
  },
  mssql: {
    text  : 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user] ORDER BY [user].[id]',
    string: 'INSERT INTO [post] ([userId]) SELECT [user].[id] FROM [user] ORDER BY [user].[id]'
  },
  oracle: {
    text  : 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"',
    string: 'INSERT INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"'
  },
  params: []
});

