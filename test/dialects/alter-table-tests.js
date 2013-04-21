'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query : post.alter().dropColumn(post.content),
  pg    : 'ALTER TABLE "post" DROP COLUMN "content"',
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql : 'ALTER TABLE `post` DROP COLUMN `content`',
  params: []
});

Harness.test({
  query : post.alter().dropColumn(post.content).dropColumn(post.userId),
  pg    : 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"',
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql : 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`',
  params: []
});

Harness.test({
  query : post.alter().dropColumn('content').dropColumn('userId'),
  pg    : 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"',
  sqlite: {
    text  : 'Sqlite cannot drop columns',
    throws: true
  },
  mysql : 'ALTER TABLE `post` DROP COLUMN `content`, DROP COLUMN `userId`',
  params: []
});

Harness.test({
  query : post.alter().rename('posts'),
  pg    : 'ALTER TABLE "post" RENAME TO "posts"',
  sqlite: 'ALTER TABLE "post" RENAME TO "posts"',
  mysql : 'ALTER TABLE `post` RENAME TO `posts`',
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
  }]
});

Harness.test({
  query : group.alter().addColumn(group.id),
  pg    : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)',
  sqlite: 'ALTER TABLE "group" ADD COLUMN "id" varchar(100)',
  mysql : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100)',
  params: []
});

Harness.test({
  query : group.alter().addColumn(group.id).addColumn(group.userId),
  pg    : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)',
  sqlite: {
    text  : 'Sqlite cannot add more than one column at a time',
    throws: true
  },
  mysql : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)',
  params: []
});

Harness.test({
  query : group.alter().addColumn('id', 'varchar(100)').addColumn('userId', 'varchar(100)'),
  pg    : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)',
  sqlite: {
    text  : 'Sqlite cannot add more than one column at a time',
    throws: true
  },
  mysql : 'ALTER TABLE `group` ADD COLUMN `id` varchar(100), ADD COLUMN `userId` varchar(100)',
  params: []
});

Harness.test({
  query : group.alter().renameColumn('userId', 'newUserId'),
  pg    : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"',
  mysql : {
    text: 'Mysql requires data type for renaming a column',
    throws: true
  },
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  params: []
});

Harness.test({
  query : group.alter().renameColumn(group.userId, 'newUserId'),
  pg    : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "newUserId"',
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mysql : 'ALTER TABLE `group` CHANGE COLUMN `userId` `newUserId` varchar(100)',
  params: []
});

Harness.test({
  query : group.alter().renameColumn('userId', group.id),
  pg    : 'ALTER TABLE "group" RENAME COLUMN "userId" TO "id"',
  sqlite: {
    text  : 'Sqlite cannot rename columns',
    throws: true
  },
  mysql : 'ALTER TABLE `group` CHANGE COLUMN `userId` `id` varchar(100)',
  params: []
});
