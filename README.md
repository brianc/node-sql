# node-sql
_sql string builder for node_

## examples

```js
//require the module
var sql = require('sql');

//first we define our table
var user = sql.define({
  name: 'user',
  columns: ['id', 'email', 'lastLogin']
});

//now we make a query
var usersWhoLoggedInBeforeToday = user.select(user.id, user.email).from(user).where(user.lastLogin.lt(new Date()));
console.log(usersWhoLoggedInBeforeToday); 
// { text: 'SELECT user.'id', user.'email' FROM user WHERE user.'lastLogin' > $1', values: ['2011-01-1'] }
```

I know this is a cop-out for now, but for more in-depth examples view `test/dialect-tests.js`

## help!

I need help with a mysql and sqlite syntax.  Even if you don't want to contribute code, I could still use some failing tests I can work towards.  You see, I don't really know mysql or sqlite syntax very well and don't use either database much.  If you'd like to contribute, please message me on github.  I'll give you commit access, and we'll be off to the races.
