var Harness = require('./support');
var post = Harness.definePostTable();
var Table = require(__dirname + '/../../lib/table');

Harness.test({
  query : post.alter().dropColumn(post.content),
  pg    : 'ALTER TABLE "post" DROP COLUMN "content"',
  params: []
});

Harness.test({
  query : post.alter().dropColumn(post.content).dropColumn(post.userId),
  pg    : 'ALTER TABLE "post" DROP COLUMN "content", DROP COLUMN "userId"',
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
  params: []
});

Harness.test({
  query : group.alter().addColumn(group.id).addColumn(group.userId),
  pg    : 'ALTER TABLE "group" ADD COLUMN "id" varchar(100), ADD COLUMN "userId" varchar(100)',
  params: []
});