'use strict';

var Harness = require('./support');
var Table = require(__dirname + '/../../lib/table');
var user = Harness.defineUserTable();
var post = Harness.definePostTable();

var u = user.as('u');
Harness.test({
  query : u.select(u.name).from(u),
  pg    :'SELECT "u"."name" FROM "user" AS "u"',
  sqlite:'SELECT "u"."name" FROM "user" AS "u"',
  mysql :'SELECT `u`.`name` FROM `user` AS `u`'
});

Harness.test({
  query : u.select(u.star()).from(u),
  pg    : 'SELECT "u".* FROM "user" AS "u"',
  sqlite: 'SELECT "u".* FROM "user" AS "u"',
  mysql : 'SELECT `u`.* FROM `user` AS `u`'
});

var p = post.as('p');
Harness.test({
  query : u.select(u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.id.equals(3)))),
  pg    : 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = $1))',
  sqlite: 'SELECT "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."id" = $1))',
  mysql : 'SELECT `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`id` = ?))',
  params : [3]
});

Harness.test({
  query : u.select(p.content, u.name).from(u.join(p).on(u.id.equals(p.userId).and(p.content.isNotNull()))),
  pg    : 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))',
  sqlite: 'SELECT "p"."content", "u"."name" FROM "user" AS "u" INNER JOIN "post" AS "p" ON (("u"."id" = "p"."userId") AND ("p"."content" IS NOT NULL))',
  mysql : 'SELECT `p`.`content`, `u`.`name` FROM `user` AS `u` INNER JOIN `post` AS `p` ON ((`u`.`id` = `p`.`userId`) AND (`p`.`content` IS NOT NULL))'
});


// the quote property isn't implemented for columns, so all columns are quoted in generated queries
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

Harness.test({
  query : comment.select(comment.text, comment.userId),
  pg    : 'SELECT "comment"."text", "comment"."userId" FROM "comment"',
  sqlite: 'SELECT "comment"."text", "comment"."userId" FROM "comment"',
  mysql : 'SELECT `comment`.`text`, `comment`.`userId` FROM `comment`'
});
