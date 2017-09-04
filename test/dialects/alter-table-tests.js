'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query: post.alter().dropColumn(post.content),
  pg: {
    text  : 'ALTER TABLE "post" DROP COLUMN "content"',
    string: 'ALTER TABLE "post" DROP COLUMN "content"'
  },
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `post` DROP COLUMN `content`',
    string: 'ALTER TABLE `post` DROP COLUMN `content`'
  },
  mssql: {
    text  : 'ALTER TABLE [post] DROP COLUMN [content]',
    string: 'ALTER TABLE [post] DROP COLUMN [content]'
  },
  oracle: {
    text  : 'ALTER TABLE "post" DROP ("content")',
    string: 'ALTER TABLE "post" DROP ("content")'
  },
  params: []
});

Harness.test({
  query: post.alter().dropColumn(post.content).dropColumn(post.userId),
  pg: {
    text  : 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"',
    string: 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"'
  },
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`',
    string: 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`'
  },
  mssql: {
    text  : 'ALTER TABLE [post] DROP COLUMN [content], [userId]',
    string: 'ALTER TABLE [post] DROP COLUMN [content], [userId]'
  },
  oracle: {
    text  : 'ALTER TABLE "post" DROP ("content", "userId")',
    string: 'ALTER TABLE "post" DROP ("content", "userId")'
  },
  params: []
});

Harness.test({
  query: post.alter().dropColumn('content').dropColumn('userId'),
  pg: {
    text  : 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"',
    string: 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"'
  },
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`',
    string: 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`'
  },
  mssql: {
    text  : 'ALTER TABLE [post] DROP COLUMN [content], [userId]',
    string: 'ALTER TABLE [post] DROP COLUMN [content], [userId]'
  },
  oracle: {
    text  : 'ALTER TABLE "post" DROP ("content", "userId")',
    string: 'ALTER TABLE "post" DROP ("content", "userId")'
  },
  params: []
});

Harness.test({
  query: post.alter().rename('posts'),
  pg: {
    text  : 'ALTER TABLE "post" RENAME TO "posts"',
    string: 'ALTER TABLE "post" RENAME TO "posts"'
  },
  sqlite: {
    text  : 'ALTER TABLE "post" RENAME TO "posts"',
    string: 'ALTER TABLE "post" RENAME TO "posts"'
  },
  mysql: {
    text  : 'ALTER TABLE `post` RENAME TO `posts`',
    string: 'ALTER TABLE `post` RENAME TO `posts`'
  },
  mssql: {
    text  : 'EXEC sp_rename [post], [posts]',
    string: 'EXEC sp_rename [post], [posts]'
  },
  params: []
});

var group = Table.define({
  name: 'group',
  columns: [{
      name: 'id',
      dataType: 'varchar(100)'
    }, {
      name: 'userId',
      dataType: 'varchar(100)'
    }
  ]
});

Harness.test({
  query: group.alter().addColumn(group.id),
  pg: {
    text  : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)',
    string: 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)'
  },
  sqlite: {
    text  : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)',
    string: 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)'
  },
  mysql: {
    text  : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100)',
    string: 'ALTER TABLE `group` ADD COLUMN `id` varchar(100)'
  },
  mssql: {
    text  : 'ALTER TABLE [group] ADD [id] varchar(100)',
    string: 'ALTER TABLE [group] ADD [id] varchar(100)'
  },
  oracle: {
    text  : 'ALTER TABLE "group" ADD ("id" varchar(100))',
    string: 'ALTER TABLE "group" ADD ("id" varchar(100))'
  },
  params: []
});

Harness.test({
  query: group.alter().addColumn(group.id).addColumn(group.userId),
  pg: {
    text  : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)',
    string: 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)'
  },
  sqlite: {
    text  : 'Sqlite cannot add more than one column at a time',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)',
    string: 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)'
  },
  mssql: {
    text  : 'ALTER TABLE [group] ADD [id] varchar(100), [userId] varchar(100)',
    string: 'ALTER TABLE [group] ADD [id] varchar(100), [userId] varchar(100)'
  },
  oracle: {
    text  : 'ALTER TABLE "group" ADD ("id" varchar(100), "userId" varchar(100))',
    string: 'ALTER TABLE "group" ADD ("id" varchar(100), "userId" varchar(100))'
  },
  params: []
});

Harness.test({
  query: group.alter().addColumn('id', 'varchar(100)').addColumn('userId', 'varchar(100)'),
  pg: {
    text  : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)',
    string: 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)'
  },
  sqlite: {
    text  : 'Sqlite cannot add more than one column at a time',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)',
    string: 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)'
  },
  mssql: {
    text  : 'ALTER TABLE [group] ADD [id] varchar(100), [userId] varchar(100)',
    string: 'ALTER TABLE [group] ADD [id] varchar(100), [userId] varchar(100)'
  },
  oracle: {
    text  : 'ALTER TABLE "group" ADD ("id" varchar(100), "userId" varchar(100))',
    string: 'ALTER TABLE "group" ADD ("id" varchar(100), "userId" varchar(100))'
  },
  params: []
});

Harness.test({
  query: group.alter().renameColumn('userId', 'newUserId'),
  pg: {
    text  : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"',
    string: 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"'
  },
  mysql: {
    text  : 'Mysql requires data type for renaming a column',
    throws: true
  },
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mssql: {
   text  : 'EXEC sp_rename \'[group].[userId]\', [newUserId], \'COLUMN\'',
   string: 'EXEC sp_rename \'[group].[userId]\', [newUserId], \'COLUMN\''
  },
  params: []
});

Harness.test({
  query: group.alter().renameColumn(group.userId, 'newUserId'),
  pg: {
    text  : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"',
    string: 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"'
  },
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `group` CHANGE COLUMN `userId` `newUserId` varchar(100)',
    string: 'ALTER TABLE `group` CHANGE COLUMN `userId` `newUserId` varchar(100)'
  },
  mssql: {
   text  : 'EXEC sp_rename \'[group].[userId]\', [newUserId], \'COLUMN\'',
   string: 'EXEC sp_rename \'[group].[userId]\', [newUserId], \'COLUMN\''
  },
  params: []
});

Harness.test({
  query: group.alter().renameColumn('userId', group.id),
  pg: {
    text  : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "id"',
    string: 'ALTER TABLE "group" RENAME COLUMN "userId" TO "id"'
  },
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mysql: {
    text  : 'ALTER TABLE `group` CHANGE COLUMN `userId` `id` varchar(100)',
    string: 'ALTER TABLE `group` CHANGE COLUMN `userId` `id` varchar(100)'
  },
  mssql: {
   text  : 'EXEC sp_rename \'[group].[userId]\', [id], \'COLUMN\'',
   string: 'EXEC sp_rename \'[group].[userId]\', [id], \'COLUMN\''
  },
  params: []
});

var UserWithSignature = Table.define({
  name: 'UserWithSignature',
  columns: [{
      name: 'Signature',
      dataType: "VARCHAR(255) NOT NULL DEFAULT 'Signature'"
    }
  ]
});

Harness.test({
  query: UserWithSignature.alter().renameColumn(UserWithSignature.get('Signature'), 'sig'),
  pg: {
    text  : 'ALTER TABLE "UserWithSignature" RENAME COLUMN "Signature" TO "sig"',
    string: 'ALTER TABLE "UserWithSignature" RENAME COLUMN "Signature" TO "sig"'
  },
  mysql: {
    text  : 'ALTER TABLE `UserWithSignature` CHANGE COLUMN `Signature` `sig` VARCHAR(255) NOT NULL DEFAULT \'Signature\'',
    string: 'ALTER TABLE `UserWithSignature` CHANGE COLUMN `Signature` `sig` VARCHAR(255) NOT NULL DEFAULT \'Signature\''
  },
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mssql: {
   text  : 'EXEC sp_rename \'[UserWithSignature].[Signature]\', [sig], \'COLUMN\'',
   string: 'EXEC sp_rename \'[UserWithSignature].[Signature]\', [sig], \'COLUMN\''
  }
});

var post = Table.define({
  name: 'post',
  columns: [{
    name: 'userId',
    dataType: 'int',
    references: {
      table: 'user',
      column: 'id'
    }
    }, {
      name: 'picture',
      dataType: 'varchar(100)',
      references: {}
    }]
});

Harness.test({
  query: post.alter().addColumn(post.userId),
  pg: {
    text  : 'ALTER TABLE "post" ADD COLUMN "userId" int REFERENCES "user"("id")',
    string: 'ALTER TABLE "post" ADD COLUMN "userId" int REFERENCES "user"("id")'
  },
  sqlite: {
    text  : 'ALTER TABLE "post" ADD COLUMN "userId" int REFERENCES "user"("id")',
    string: 'ALTER TABLE "post" ADD COLUMN "userId" int REFERENCES "user"("id")'
  },
  mysql: {
    text  : 'ALTER TABLE `post` ADD COLUMN `userId` int REFERENCES `user`(`id`)',
    string: 'ALTER TABLE `post` ADD COLUMN `userId` int REFERENCES `user`(`id`)'
  },
  oracle: {
    text  : 'ALTER TABLE "post" ADD ("userId" int REFERENCES "user"("id"))',
    string: 'ALTER TABLE "post" ADD ("userId" int REFERENCES "user"("id"))'
  },
  params: []
});

Harness.test({
  query: post.alter().addColumn(post.picture),
  pg: {
    text  : 'ALTER TABLE "post" ADD COLUMN "picture" varchar(100)',
    string: 'ALTER TABLE "post" ADD COLUMN "picture" varchar(100)'
  },
  sqlite: {
    text  : 'ALTER TABLE "post" ADD COLUMN "picture" varchar(100)',
    string: 'ALTER TABLE "post" ADD COLUMN "picture" varchar(100)'
  },
  mysql: {
    text  : 'ALTER TABLE `post` ADD COLUMN `picture` varchar(100)',
    string: 'ALTER TABLE `post` ADD COLUMN `picture` varchar(100)'
  },
  oracle: {
    text  : 'ALTER TABLE "post" ADD ("picture" varchar(100))',
    string: 'ALTER TABLE "post" ADD ("picture" varchar(100))'
  },
  params: []
});
