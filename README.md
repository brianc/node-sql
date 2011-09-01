# node-sql
_sql string builder for node_

m4j0r work in progress...view tests for more examples

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
