var sql = require('./lib');
var user = sql.define({
  name: 'user',
  columns: ['id', 'lastLogin', 'email']
});

// this also makes parts of your queries composable, which is handy
var friendship = sql.define({
  name: 'friendship',
  columns: ['userId', 'friendId']
});

var friends = user.as('friends');
var userToFriends = user
  .leftJoin(friendship).on(user.id.equals(friendship.userId))
  .leftJoin(friends).on(friendship.friendId.equals(friends.id));

//and now...compose...
var friendsWhoHaveLoggedInQuery = user.from(userToFriends).where(friends.lastLogin.isNotNull());
console.log(friendsWhoHaveLoggedInQuery.toQuery().text);
// SELECT * FROM "user"
// LEFT JOIN "friendship" ON ("user"."id" = "friendship"."userId")
// LEFT JOIN "user" AS "friends" ON ("friendship"."friendId" = "friends"."id")
// WHERE "friends"."lastLogin" IS NOT NULL

var friendsWhoUseGmailQuery = user.from(userToFriends).where(friends.email.like('%@gmail.com'));
console.log(friendsWhoUseGmailQuery.toQuery().text);
// SELECT * FROM "user"
// LEFT JOIN "friendship" ON ("user"."id" = "friendship"."userId")
// LEFT JOIN "user" AS "friends" ON ("friendship"."friendId" = "friends"."id")
// WHERE "friends"."email" LIKE %1
