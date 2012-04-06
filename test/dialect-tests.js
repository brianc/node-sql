var assert = require('assert');
var Postgres = require(__dirname + '/../lib/dialect/postgres');
var Table = require(__dirname + '/../lib/table');

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

var user = Table.define({
  name: 'user',
  quote: true,
  columns: ['id','name']
})

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

test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').or(user.name.equals('bar'))),
  pg    : 'SELECT "user".id FROM "user" WHERE (("user".name = $1) OR ("user".name = $2))',
  params: ['foo', 'bar']
});

test({
  query : user.select(user.id).from(user).where(user.name.equals('foo').and(user.name.equals('bar'))),
  pg    : 'SELECT "user".id FROM "user" WHERE (("user".name = $1) AND ("user".name = $2))',
  params: ['foo', 'bar']
});

test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('bar')),
  pg    : 'SELECT "user".id FROM "user" WHERE (("user".name = $1) OR ("user".name = $2))'
});

test({
  query : user.select(user.id).from(user).where(user.name.equals('foo')).or(user.name.equals('baz')).and(user.name.equals('bar')),
  pg    : 'SELECT "user".id FROM "user" WHERE ((("user".name = $1) OR ("user".name = $2)) AND ("user".name = $3))'
});

test({
  query : user.select(user.id).from(user)
            .where(user.name.equals('boom')
                  .and(user.id.equals(1))).or(user.name.equals('bang').and(user.id.equals(2))),
  pg    : 'SELECT "user".id FROM "user" WHERE ((("user".name = $1) AND ("user".id = $2)) OR (("user".name = $3) AND ("user".id = $4)))'
});

var post = Table.define({
  name: 'post',
  columns: ['id', 'userId', 'content']
});

test({
  query : user.select(user.name, post.content).from(user.join(post).on(user.id.equals(post.userId))),
  pg    : 'SELECT "user".name, post.content FROM "user" INNER JOIN post ON ("user".id = post."userId")'
});

var u = user.as('u');
test({
  query : u.select(u.name).from(u),
  pg    :'SELECT u.name FROM "user" AS u' 
});

var p = post.as('p');
test({
  query : u.select(u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.id.equals(3)))),
  pg    : 'SELECT u.name FROM "user" AS u INNER JOIN post AS p ON ((u.id = p."userId") AND (p.id = $1))'
});

test({
  query : u.select(p.content, u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.content.isNotNull()))),
  pg    : 'SELECT p.content, u.name FROM "user" AS u INNER JOIN post AS p ON ((u.id = p."userId") AND (p.content IS NOT NULL))'
});

console.log('inserting plain SQL');
test({
  query : user.select('name').from('user').where('name <> NULL'),
  pg    : 'SELECT name FROM user WHERE name <> NULL'
});

console.log('automatic FROM on "easy" queries');
test({
  query : post.select(post.content),
  pg    : 'SELECT post.content FROM post'
});

test({
  query : post.select(post.content).where(post.userId.equals(1)),
  pg    : 'SELECT post.content FROM post WHERE (post."userId" = $1)'
});

console.log('order by');

test({
  query : post.select(post.content).order(post.content),
  pg    : 'SELECT post.content FROM post ORDER BY post.content',
});

test({
  query : post.select(post.content).order(post.content, post.userId.descending),
  pg    : 'SELECT post.content FROM post ORDER BY post.content, (post."userId"  DESC)'
});

test({
  query : post.select(post.content).order(post.content.asc, post.userId.desc),
  pg    : 'SELECT post.content FROM post ORDER BY post.content, (post."userId"  DESC)'
});

console.log('insert');

test({
  query : post.insert(post.content.value('test'), post.userId.value(1)),
  pg    : 'INSERT INTO post (content, "userId") VALUES ($1, $2)',
  params: ['test', 1]
});

test({
  query : post.insert(post.content.value('whoah')),
  pg    : 'INSERT INTO post (content) VALUES ($1)',
  params: ['whoah']
});

test({
  query : post.insert({content: 'test', userId: 2}),
  pg    : 'INSERT INTO post (content, "userId") VALUES ($1, $2)',
  params: ['test', 2]
});

console.log('update');

test({
  query : post.update({content: 'test'}),
  pg    : 'UPDATE post SET post.content = $1',
  params: ['test']
});

test({
  query : post.update({content: 'test', userId: 3}),
  pg    : 'UPDATE post SET post.content = $1, post."userId" = $2',
  params: ['test', 3]
});

test({
  query : post.update({content: 'test', userId: 3}).where(post.content.equals('no')),
  pg    : 'UPDATE post SET post.content = $1, post."userId" = $2 WHERE (post.content = $3)',
  params: ['test', 3, 'no']
});

console.log('IGNORE: parent queries');
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

test({
  query : comment.select(comment.text, comment.userId),
  pg    : 'SELECT comment."text", comment.userId FROM comment',
});
