var assert = require('assert');
var sql = require(__dirname + '/../lib');

describe('column', function() {
  var table = sql.define({
    name: 'user',
    columns: ['id', 'created']
  });

  it('can be accessed by property and array', function() {
    assert.equal(table.created, table.columns[1], 'should be able to access created both by array and property');
  });

  describe('toQuery()', function() {
    it('works', function() {
      assert.equal(table.id.toQuery().text, '"user"."id"');
    });

    it('respects AS rename', function() {
      assert.equal(table.id.as('userId').toQuery().text, '"user"."id" AS "userId"');
    });

    it('respects count and distinct', function() {
      assert.equal(table.id.count().distinct().as("userIdCount").toQuery().text, 'COUNT(DISTINCT("user"."id")) AS "userIdCount"');
    });

    describe('in subquery with min', function() {
      var subquery = table.subQuery('subTable').select(table.id.min().as('subId'));
      var col = subquery.subId.toQuery().text;
      assert.equal(col, '"subTable"."subId"');
    });
  });
});
