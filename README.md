# node-sql
_sql string builder for node_ - supports PostgreSQL, mysql, and sqlite dialects.

Building SQL statements by hand is no fun, especially in a language which has clumsy support for multi-line strings.

So let's build it with JavaScript.

Maybe it's still not fun, but at least it's _less not fun_.

[![Build Status](https://secure.travis-ci.org/brianc/node-sql.png)](http://travis-ci.org/brianc/node-sql)

## examples

```js
//require the module
var sql = require('sql');

//first we define our tables
var user = sql.define({
  name: 'user',
  columns: ['id', 'email', 'lastLogin']
});

var post = sql.define({
  name: 'post',
  columns: ['id', 'userId', 'date', 'title', 'body']
});

//now let's make a simple query
var query = user.select(user.star()).from(user).toQuery();
console.log(query.text); //SELECT "user".* FROM "user"

//something more interesting
var query = user
    .select(user.id)
    .from(user)
    .where(
      user.name.equals('boom').and(user.id.equals(1))
    ).or(
      user.name.equals('bang').and(user.id.equals(2))
    ).toQuery();

//query is parameterized by default
console.log(query.text); //SELECT "user"."id" FROM "user" WHERE ((("user"."name" = $1) AND ("user"."id" = $2)) OR (("user"."name" = $3) AND ("user"."id" = $4)))

console.log(query.values); //['boom', 1, 'bang', 2]


//how about a join?
var query = user.select(user.name, post.content)
  .from(user.join(post).on(user.id.equals(post.userId))).toQuery();
  
console.log(query.text); //'SELECT "user"."name", "post"."content" FROM "user" INNER JOIN "post" ON ("user"."id" = "post"."userId")'

//this also makes parts of your queries composable, which is handy

var friendship = sql.define({
  name: 'friendship',
  columns: ['userId', 'friendId']
});

var friends = user.as('friends');
var userToFriends = user
  .leftJoin(friendship.on(user.id.equals(friendship.userId)))
  .leftJoin(friends.on(friendship.friendId.equals(friends.id)));
  
//and now...compose...
var friendsWhoHaveLoggedInQuery = userToFriends.where(friends.lastLogin.notNull());
//SELECT * FROM "user" 
//LEFT JOIN "friendship" ON ("user"."id" = "friendship"."userId") 
//LEFT JOIN "user" AS "friends" ON ("friendship"."friendId" = "friends"."id")
//WHERE "friends"."lastLogin" IS NOT NULL

var friendsWhoUseGmailQuery = userToFriends.where(friends.email.like('%@gmail.com'));
//SELECT * FROM "user" 
//LEFT JOIN "friendship" ON ("user"."id" = "friendship"."userId") 
//LEFT JOIN "user" AS "friends" ON ("friendship"."friendId" = "friends"."id")
//WHERE "friends"."email" LIKE %1

```

There are a __lot__ more examples included in the `test/dialects` folder.

## contributing

I __love__ contributions.  If I could, I would write __love__ 500 times, but that would be readme bloat.

Still, that's how much I love them.  Let's work _together_ on this.

If you want to contribute here's what you do:

1. fork the repo
2. `git pull https://github.com/(your_username)/node-sql`
3. `cd node-sql`
4. `npm install`
5. `npm test`

At this point the tests should pass for you.  If they don't pass please open an issue with the output or you can even send me an email directly.  My email address is on my github profile and also on every commit I contributed in the repo.

Once the tests are passing, modify as you see fit.  _Please_ make sure you write tests to cover your modifications.  Once you're ready, commit your changes and submit a pull request.

__As long as your pull request doesn't have completely off-the-wall changes and it does have tests I will almost always merge it right away and push it to npm__

If you think your changes are too off-the-wall, open an issue or a pull-request without code so we can discuss them.

__Seriously:__

    your contributions >= my contributions

I definitely need help with mysql and sqlite syntax.  I'm not very familiar...so that's always a good place to start.

##license
MIT
