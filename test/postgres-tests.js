var assert = require('assert');
var Postgres = require(__dirname + '/../lib/dialect/postgres');
var Table = require(__dirname + '/../lib/table');

var user = Table.define({
  name: 'user',
  quote: true,
  columns: ['id','name']
})

assert.textEqual = function(query, expected) {
  var q = new Postgres().getQuery(query).text;
  assert.equal(q, expected, 'Query text not equal\n actual:   "' + q + '"\n expected: "' + expected + '"');
}

assert.paramsEqual = function(query, expected) {
  var q = new Postgres().getQuery(query);
  assert.equal(q.values.length, expected.length);
  for(var i = 0; i < q.values.length; i++) {
    assert.equal(q.values[i], expected[i]);
  }
}

var test = function(expected) {
  var query = expected.query;
  var pgQuery = new Postgres().getQuery(query);
  var expectedPgText = expected.pg;
  assert.equal(pgQuery.text, expected.pg, 'Postgres text not equal\n actual:   "' + pgQuery.text + '"\n expected: "' + expected.pg + '"');
  if(expected.params) {
    assert.equal(expected.params.length, pgQuery.values.length);
    for(var i = 0; i < expected.params.length; i++) {
      assert.equal(expected.params[i], pgQuery.values[i]);
    }
  }
}

test({
  query : user.select(user.id).from(user),
  pg    : 'SELECT "user".id FROM "user"'
});

test({
  query : user.select(user.id, user.name).from(user), 
  pg    : 'SELECT "user".id, "user".name FROM "user"'
});

test({
  query : user.select(user.star()).from(user),
  pg    : 'SELECT "user".* FROM "user"'
});

test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')),
  pg    : 'SELECT "user".id FROM "user" WHERE ("user".name = $1)',
  params: ['foo']
});

var q = user.select(user.id).from(user).where(user.name.equals('foo').or(user.name.equals('bar')));
assert.textEqual(q, 'SELECT "user".id FROM "user" WHERE (("user".name = $1) OR ("user".name = $2))');
assert.paramsEqual(q, ['foo', 'bar']);

var q = user.select(user.id).from(user)
  .where(user.name.equals('foo')
         .and(user.name.equals('bar')));
assert.textEqual(q, 'SELECT "user".id FROM "user" WHERE (("user".name = $1) AND ("user".name = $2))');
assert.paramsEqual(q, ['foo', 'bar']);

var q = user.select(user.id).from(user)
  .where(user.name.equals('foo'))
  .or(user.name.equals('bar'));
assert.textEqual(q, 'SELECT "user".id FROM "user" WHERE (("user".name = $1) OR ("user".name = $2))');

var q = user.select(user.id).from(user)
  .where(user.name.equals('foo'))
  .or(user.name.equals('baz'))
  .and(user.name.equals('bar'));
assert.textEqual(q, 'SELECT "user".id FROM "user" WHERE ((("user".name = $1) OR ("user".name = $2)) AND ("user".name = $3))');

var q = user.select(user.id).from(user)
  .where(user.name.equals('boom').and(user.id.equals(1)))
  .or(user.name.equals('bang').and(user.id.equals(2)));
assert.textEqual(q, 'SELECT "user".id FROM "user" WHERE ((("user".name = $1) AND ("user".id = $2)) OR (("user".name = $3) AND ("user".id = $4)))');

var post = Table.define({
  name: 'post',
  columns: ['id', 'userId', 'content']
});

var q = user.select(user.name, post.content).from(user.join(post).on(user.id.equals(post.userId)));
assert.textEqual(q, 'SELECT "user".name, post.content FROM "user" INNER JOIN post ON ("user".id = post."userId")');

var u = user.as('u');
var q = u.select(u.name).from(u);
assert.textEqual(q, 'SELECT u.name FROM "user" AS u');

var p = post.as('p');
var q = u.select(u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.id.equals(3))));

assert.textEqual(q, 'SELECT u.name FROM "user" AS u INNER JOIN post AS p ON ((u.id = p."userId") AND (p.id = $1))');

var q = u.select(p.content, u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.content.isNotNull())));
assert.textEqual(q, 'SELECT p.content, u.name FROM "user" AS u INNER JOIN post AS p ON ((u.id = p."userId") AND (p.content IS NOT NULL))');

console.log('inserting plain SQL');
var q = user.select('name').from('user').where('name <> NULL');
assert.textEqual(q, 'SELECT name FROM user WHERE name <> NULL');

console.log('automatic FROM on "easy" queries');
var q = post.select(post.content);
assert.textEqual(q, 'SELECT post.content FROM post');
var q = post.select(post.content).where(post.userId.equals(1));
assert.textEqual(q, 'SELECT post.content FROM post WHERE (post."userId" = $1)');

console.log('order by');
var q = post.select(post.content).order(post.content);
assert.textEqual(q, 'SELECT post.content FROM post ORDER BY post.content');
var q = post.select(post.content).order(post.content, post.userId.descending);
assert.textEqual(q, 'SELECT post.content FROM post ORDER BY post.content, (post."userId"  DESC)');
var q = post.select(post.content).order(post.content.asc, post.userId.desc);
assert.textEqual(q, 'SELECT post.content FROM post ORDER BY post.content, (post."userId"  DESC)');

console.log('parent queries');
var ignore = function() { 
var parent = post.select(post.content);
assert.textEqual(parent, 'SELECT post.content FROM post');
var child = parent.select(post.userId).where(post.userId.equals(1));
assert.textEqual(parent, 'SELECT post.content FROM post');
assert.textEqual(child, 'SELECT post.content, post."userId" FROM post WHERE (post."userId" = $1)');
}

console.log('quoting column names');
var comment = Table.define({
  name: 'comment',
  columns: [{
    name: 'text',
    quote: true
  }, {
    name: 'userId',
    quote: false
  }]
});

var q = comment.select(comment.text, comment.userId);
assert.textEqual(q, 'SELECT comment."text", comment.userId FROM comment');
