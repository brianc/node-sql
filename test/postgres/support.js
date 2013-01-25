var tap = require('tap').test;
var Postgres = require('../../lib/dialect/postgres');
var Table = require(__dirname + '/../../lib/table');

module.exports = {
  test:  function(expected) {
    tap(expected.pg, function(t) {
      var query = expected.query;
      var pgQuery = new Postgres().getQuery(query);
      var expectedPgText = expected.pg;
      t.equal(pgQuery.text, expected.pg, 'Postgres text not equal\n actual:   "' + pgQuery.text + '"\n expected: "' + expected.pg + '"');
      if(expected.params) {
        t.equal(expected.params.length, pgQuery.values.length);
        for(var i = 0; i < expected.params.length; i++) {
          t.equal(expected.params[i], pgQuery.values[i]);
        }
      }
      t.end();
    });
  },

  defineUserTable: function () {
    return Table.define({
      name: 'user',
      quote: true,
      columns: ['id','name']
    });
  },

  definePostTable: function () {
    return Table.define({
      name: 'post',
      columns: ['id', 'userId', 'content']
    });
  },

  defineCommentTable: function () {
    return Table.define({
      name: 'comment',
      columns: ['postId', 'text']
    });
  }
};







