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
  query: post.replace(post.content.value('test'), post.userId.value(1)),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (\'test\', 1)'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (\'test\', 1)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['test', 1]
});

Harness.test({
  query: post.replace(post.content.value('whoah')),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content") VALUES ($1)',
    string: 'REPLACE INTO "post" ("content") VALUES (\'whoah\')'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`) VALUES (?)',
    string: 'REPLACE INTO `post` (`content`) VALUES (\'whoah\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['whoah']
});

Harness.test({
  query: post.replace({length: 0}),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("length") VALUES ($1)',
    string: 'REPLACE INTO "post" ("length") VALUES (0)'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`length`) VALUES (?)',
    string: 'REPLACE INTO `post` (`length`) VALUES (0)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [0]
});

Harness.test({
  query: post.replace({
    content: 'test',
    userId: 2
  }),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (\'test\', 2)'
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
  query: post.replace({
    content: post.sql.functions.LOWER('TEST'),
    userId: 2
  }),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES (LOWER($1), $2)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (LOWER(\'TEST\'), 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['TEST', 2]
});

// allow bulk replace
Harness.test({
  query: post.replace([{
      content: 'whoah'
    }, {
      content: 'hey'
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content") VALUES ($1), ($2)',
    string: 'REPLACE INTO "post" ("content") VALUES (\'whoah\'), (\'hey\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['whoah', 'hey']
});

Harness.test({
  query: post.replace([{
      content: 'whoah',
      userId: 1
    }, {
      content: 'hey',
      userId: 2
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['whoah', 1, 'hey', 2]
});

// consistent order
Harness.test({
  query: post.replace([{
      content: 'whoah',
      userId: 1
    }, {
      userId: 2,
      content: 'hey'
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2), ($3, $4)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?), (?, ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (\'whoah\', 1), (\'hey\', 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['whoah', 1, 'hey', 2]
});

Harness.test({
  query: post.replace({}),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" DEFAULT VALUES',
    string: 'REPLACE INTO "post" DEFAULT VALUES'
  },
  mysql: {
    text  : 'REPLACE INTO `post` () VALUES ()',
    string: 'REPLACE INTO `post` () VALUES ()'
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
  query: post.replace({}).returning('*'),
  pg: {
    throws: true
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
  query: post.replace({}).returning(post.star()),
  pg: {
    throws: true
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
  query: post.replace({}).returning(post.id),
  pg: {
    throws: true
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
  query: post.replace({}).returning(post.id, post.content),
  pg: {
    throws: true
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
  query: post.replace({}).returning([post.id, post.content]),
  pg: {
    throws: true
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
  query: post.replace([{
      content: 'whoah',
      userId: 1
    }, {
      content: 'hey'
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'Sqlite requires the same number of columns in each replace row',
    throws: true
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?), (?, DEFAULT)',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (\'whoah\', 1), (\'hey\', DEFAULT)',
    params: ['whoah', 1, 'hey']
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
});

Harness.test({
  query: post.replace([{
      userId: 1
    }, {
      content: 'hey',
      userId: 2
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'Sqlite requires the same number of columns in each replace row',
    throws: true
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`, `content`) VALUES (?, DEFAULT), (?, ?)',
    string: 'REPLACE INTO `post` (`userId`, `content`) VALUES (1, DEFAULT), (2, \'hey\')',
    params: [1, 2, 'hey']
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
});

Harness.test({
  query: post.replace(post.content, post.userId)
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'REPLACE INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE \'A%\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['A%']
});

Harness.test({
  query: post.replace([post.content, post.userId])
      .select('\'test\'', user.id).from(user).where(user.name.like('A%')),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'REPLACE INTO "post" ("content", "userId") SELECT \'test\', "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) SELECT \'test\', `user`.`id` FROM `user` WHERE (`user`.`name` LIKE \'A%\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['A%']
});

Harness.test({
  query: post.replace(post.userId)
      .select(user.id).from(user).where(user.name.like('A%')),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE $1)',
    string: 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user" WHERE ("user"."name" LIKE \'A%\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['A%']
});

Harness.test({
  query: post.replace(post.userId)
      .select(post.userId).from(user.join(post).on(user.id.equals(post.userId))).where(post.tags.like('A%')),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE $1)',
    string: 'REPLACE INTO "post" ("userId") SELECT "post"."userId" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId") WHERE ("post"."tags" LIKE \'A%\')'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT `post`.`userId` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`) WHERE (`post`.`tags` LIKE ?)',
    string: 'REPLACE INTO `post` (`userId`) SELECT `post`.`userId` FROM `user` INNER JOIN `post` ON (`user`.`id` = `post`.`userId`) WHERE (`post`.`tags` LIKE \'A%\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: ['A%']
});

Harness.test({
  query: post.replace(post.userId).select(user.id).distinct().from(user),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"',
    string: 'REPLACE INTO "post" ("userId") SELECT DISTINCT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT DISTINCT `user`.`id` FROM `user`',
    string: 'REPLACE INTO `post` (`userId`) SELECT DISTINCT `user`.`id` FROM `user`'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: []
});

// Binary replaces
Harness.test({
  query: post.replace(post.content.value(new Buffer('test')), post.userId.value(2)),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (x\'74657374\', 2)'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (x\'74657374\', 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [new Buffer('test'), 2]
});

Harness.test({
  query: post.replace({
    content: new Buffer('test'),
    userId: 2
  }),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content", "userId") VALUES ($1, $2)',
    string: 'REPLACE INTO "post" ("content", "userId") VALUES (x\'74657374\', 2)'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?)',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (x\'74657374\', 2)'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [new Buffer('test'), 2]
});

Harness.test({
  query: post.replace([{
      content: new Buffer('whoah')
    }, {
      content: new Buffer('hey')
    }
  ]),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("content") VALUES ($1), ($2)',
    string: 'REPLACE INTO "post" ("content") VALUES (x\'77686f6168\'), (x\'686579\')'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`content`) VALUES (?), (?)',
    string: 'REPLACE INTO `post` (`content`) VALUES (x\'77686f6168\'), (x\'686579\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: [new Buffer('whoah'), new Buffer('hey')]
});

Harness.test({
  query: post.replace({
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
    text  : 'REPLACE INTO `post` (`content`, `userId`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `post`.`content` = ?',
    string: 'REPLACE INTO `post` (`content`, `userId`) VALUES (\'test\', 2) ON DUPLICATE KEY UPDATE `post`.`content` = \'testupdate\''
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
  query: customerAliasTable.replace({
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
  query: customerAliasTable.replace({
    id : 2,
    name : 'test'
  }).orIgnore(),
  mysql: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE OR IGNORE INTO "customer" ("id", "name") VALUES ($1, $2)',
    string: 'REPLACE OR IGNORE INTO "customer" ("id", "name") VALUES (2, \'test\')'
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
  query: post.replace({
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
    throws: true
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
  query: post.replace({
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
    throws: true
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
  query: post.replace({
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
    throws: true
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
  query: post.replace({
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
    throws: true
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
  query: post.replace({
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
    throws: true
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
  query: post.replace({
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
    throws: true
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
  query: contentTable.replace({
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
    throws: true
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
  query: contentTable.replace({
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
    throws: true
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
  query: post.replace([]),

  mysql: {
    text  : 'SELECT `post`.* FROM `post` WHERE (1=2)',
    string: 'SELECT `post`.* FROM `post` WHERE (1=2)'
  },
  params: []
});

Harness.test({
  query: arrayTable.replace(arrayTable.id.value(1), arrayTable.numbers.value([2, 3, 4])),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'REPLACE INTO "arraytest" ("id", "numbers") VALUES (1, \'[2,3,4]\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  }
});

Harness.test({
  query: arrayTable.replace(arrayTable.id.value(1), arrayTable.numbers.value(["one", "two", "three"])),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "arraytest" ("id", "numbers") VALUES ($1, $2)',
    string: 'REPLACE INTO "arraytest" ("id", "numbers") VALUES (1, \'["one","two","three"]\')'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  }
});

Harness.test({
  query: post.replace(post.userId).select(user.id).from(user),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
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
  query: post.replace(post.userId).select(user.id).from(user).onConflict({
    columns: ['userId'],
    update: ['content']
  }),
  pg: {
    throws: true
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
  query: post.replace(post.userId).add(user.select(user.id)),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
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
  query: post.replace(post.userId).add(user.select(user.id).from(user)),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"',
    string: 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user"'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`',
    string: 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user`'
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
  query: post.replace(post.userId).add(user.select(user.id).order(user.id)),
  pg: {
    throws: true
  },
  sqlite: {
    text  : 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"',
    string: 'REPLACE INTO "post" ("userId") SELECT "user"."id" FROM "user" ORDER BY "user"."id"'
  },
  mysql: {
    text  : 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user` ORDER BY `user`.`id`',
    string: 'REPLACE INTO `post` (`userId`) SELECT `user`.`id` FROM `user` ORDER BY `user`.`id`'
  },
  mssql: {
    throws: true
  },
  oracle: {
    throws: true
  },
  params: []
});
