'use strict';

var Harness = require('./support');
var user = Harness.defineUserTable();

//simple view create
Harness.test({
  query: user.select(user.star()).createView('allUsersView'),
  pg: {
    text  : '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")',
    string: '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")'
  },
  sqlite: {
    text  : '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")',
    string: '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")'
  },
  mysql: {
    text  : '(CREATE VIEW `allUsersView` AS SELECT `user`.* FROM `user`)',
    string: '(CREATE VIEW `allUsersView` AS SELECT `user`.* FROM `user`)'
  },
  mssql: {
    text  : '(CREATE VIEW [allUsersView] AS SELECT [user].* FROM [user])',
    string: '(CREATE VIEW [allUsersView] AS SELECT [user].* FROM [user])'
  },
  oracle: {
    text  : '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")',
    string: '(CREATE VIEW "allUsersView" AS SELECT "user".* FROM "user")'
  }
});

//create view with parameters
Harness.test({
  query: user.select(user.star()).where(user.id.equals(1)).createView('oneUserView'),
  pg: {
    text  : '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))',
    string: '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))'
  },
  sqlite: {
    text  : '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))',
    string: '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))'
  },
  mysql: {
    text  : '(CREATE VIEW `oneUserView` AS SELECT `user`.* FROM `user` WHERE (`user`.`id` = 1))',
    string: '(CREATE VIEW `oneUserView` AS SELECT `user`.* FROM `user` WHERE (`user`.`id` = 1))'
  },
  mssql: {
    text  : '(CREATE VIEW [oneUserView] AS SELECT [user].* FROM [user] WHERE ([user].[id] = 1))',
    string: '(CREATE VIEW [oneUserView] AS SELECT [user].* FROM [user] WHERE ([user].[id] = 1))'
  },
  oracle: {
    text  : '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))',
    string: '(CREATE VIEW "oneUserView" AS SELECT "user".* FROM "user" WHERE ("user"."id" = 1))'
  }
});

//Tests error raised for non-SELECT create view attempts
Harness.test({
  query: user.delete().where(user.id.equals(1)).createView('oneUserView'),
  pg: {
    text  : 'Create View requires a Select.',
    throws: true
  },
  sqlite: {
    text  : 'Create View requires a Select.',
    throws: true
  },
  mysql: {
    text  : 'Create View requires a Select.',
    throws: true
  },
  mssql: {
    text  : 'Create View requires a Select.',
    throws: true
  },
  oracle: {
    text  : 'Create View requires a Select.',
    throws: true
  },
  params: []
});
