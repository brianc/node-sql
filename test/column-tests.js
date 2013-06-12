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

  describe('extra text to column', function() {
    it('can be used to cast', function() {
      assert.equal(table.id.appendText('::text').toQuery().text, '"user"."id"::text');
    });

    it('can be used to access hstore data', function() {
      assert.equal(table.id.appendText("::hstore->'data'").toQuery().text, '"user"."id"::hstore->\'data\'')
    });

    it('can be chained', function() {
      assert.equal(table.id.count().appendText('::text').as('count').toQuery().text, 'COUNT("user"."id"::text) AS "count"');
      assert.equal(table.id.appendText('::text').as('count').count().toQuery().text, 'COUNT("user"."id"::text) AS "count"');
    });
  });

  describe('aggregate', function() {
    it('works with supplied alias', function() {
      assert.equal(table.id.count('idCount').toQuery().text, 'COUNT("user"."id") AS "idCount"');
      assert.equal(table.id.toNode().count('idCount').toQuery().text, 'COUNT("user"."id") AS "idCount"');
    });

    it('works with named column', function() {
      assert.equal(table.id.count().toQuery().text, 'COUNT("user"."id") AS "id_count"');
      assert.equal(table.id.toNode().count().toQuery().text, 'COUNT("user"."id") AS "id_count"');
    });

    it('works with previously aliased column', function() {
      assert.equal(table.id.as('boom').count().toQuery().text, 'COUNT("user"."id") AS "boom"');
      assert.equal(table.id.toNode().as('boom').count().toQuery().text, 'COUNT("user"."id") AS "boom"');
    });
  });
});
