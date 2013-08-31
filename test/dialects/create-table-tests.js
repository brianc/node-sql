'use strict';

var Table = require(__dirname + '/../../lib/table');
var Harness = require('./support');

var group = Table.define({
  name: 'group',
  columns: [{
      name: 'id',
      dataType: 'varchar(100)'
    }, {
      name: 'user_id',
      dataType: 'varchar(100)'
    }
  ]
});

Harness.test({
  query: group.create(),
  pg: {
    text  : 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))',
    string: 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))',
    string: 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `group` (`id` varchar(100), `user_id` varchar(100))',
    string: 'CREATE TABLE `group` (`id` varchar(100), `user_id` varchar(100))'
  },
  params: []
});

Harness.test({
  query: group.create().ifNotExists(),
  pg: {
    text  : 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))',
    string: 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))',
    string: 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE IF NOT EXISTS `group` (`id` varchar(100), `user_id` varchar(100))',
    string: 'CREATE TABLE IF NOT EXISTS `group` (`id` varchar(100), `user_id` varchar(100))'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
        name: 'id',
        dataType: 'varchar(100)'
      }
    ],
    engine: 'InnoDB'
  }).create(),
  pg: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `user` (`id` varchar(100)) ENGINE=InnoDB',
    string: 'CREATE TABLE `user` (`id` varchar(100)) ENGINE=InnoDB'
  }
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
        name: 'id',
        dataType: 'varchar(100)'
      }
    ],
    charset: 'latin1'
  }).create(),
  pg: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `user` (`id` varchar(100)) DEFAULT CHARSET=latin1',
    string: 'CREATE TABLE `user` (`id` varchar(100)) DEFAULT CHARSET=latin1'
  }
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
        name: 'id',
        dataType: 'varchar(100)'
      }
    ],
    engine: 'MyISAM',
    charset: 'latin1'
  }).create(),
  pg: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `user` (`id` varchar(100)) ENGINE=MyISAM DEFAULT CHARSET=latin1',
    string: 'CREATE TABLE `user` (`id` varchar(100)) ENGINE=MyISAM DEFAULT CHARSET=latin1'
  }
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
      name: 'id',
      dataType: 'int',
      primaryKey: true
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "user" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "user" ("id" int PRIMARY KEY)'
  },
  sqlite: {
    text  : 'CREATE TABLE "user" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "user" ("id" int PRIMARY KEY)'
  },
  mysql: {
    text  : 'CREATE TABLE `user` (`id` int PRIMARY KEY)',
    string: 'CREATE TABLE `user` (`id` int PRIMARY KEY)'
  }
});
