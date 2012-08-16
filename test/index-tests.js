var test = require('tap').test;
var sql = require(__dirname + '/../lib');

var user = sql.define({
  name: 'user',
  columns: ['id', 'email']
});

test('unknown dialect', function(t) {
  console.log('unknown dialog throws exception');
  t.throws(function() {
    sql.setDialect('asdf');
  })
  t.end();
});


test('throws before dialect is set', function(t) {
  t.throws(function() {
    var query = sql.select(user.id).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
  });
  t.end();
});

test('setting dialect to postgres works', function(t) {
  sql.setDialect('postgres');
  var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
  t.equal(query.text, 'SELECT "user"."id" FROM "user" WHERE ("user"."email" = $1)');
  t.equal(query.values[0], 'brian.m.carlson@gmail.com')
  t.end();
});
