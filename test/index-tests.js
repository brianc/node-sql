var assert = require('assert');
var sql = require(__dirname + '/../lib');

var user = sql.define({
  name: 'user',
  columns: ['id', 'email']
});

console.log('unknown dialog throws exception');
assert.throws(function() {
  sql.setDialect('asdf');
})

//throws before dialog is set
assert.throws(function() {
  var query = sql.select(user.id).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
})

sql.setDialect('postgres');
var query = sql.select(user.id).from(user).where(user.email.equals('brian.m.carlson@gmail.com')).toQuery();
assert.equal(query.text, 'SELECT user.id FROM user WHERE (user.email = $1)');
assert.equal(query.values[0], 'brian.m.carlson@gmail.com')
