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

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'userId',
      dataType: 'int',
      references: {
        table: 'user',
        column: 'id'
      }
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES user(id))',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES user(id))'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES user(id))',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES user(id))'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`userId` int REFERENCES user(id))',
    string: 'CREATE TABLE `post` (`userId` int REFERENCES user(id))'
  },
  params: []
});

Harness.test({
  query: Table.define({
  name: 'picture',
  columns: [{
    name: 'userId',
    dataType: 'int',
    references: {
      table: 'user',
      column: 'id'
    }
    }, {
      name: 'caption',
      dataType: 'varchar(100)',
      references: {}
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES user(id), "caption" varchar(100))',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES user(id), "caption" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES user(id), "caption" varchar(100))',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES user(id), "caption" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `picture` (`userId` int REFERENCES user(id), `caption` varchar(100))',
    string: 'CREATE TABLE `picture` (`userId` int REFERENCES user(id), `caption` varchar(100))'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'userId',
      dataType: 'int',
      references: 'user'
    }]
  }).create(),
  pg: {
    text  : 'references is not a object for column userId (REFERENCES statements within CREATE TABLE and ADD COLUMN statements require refrences to be expressed as an object)',
    throws: true
  },
  sqlite: {
    text  : 'references is not a object for column userId (REFERENCES statements within CREATE TABLE and ADD COLUMN statements require refrences to be expressed as an object)',
    throws: true
  },
  mysql: {
    text  : 'references is not a object for column userId (REFERENCES statements within CREATE TABLE and ADD COLUMN statements require refrences to be expressed as an object)',
    throws: true
  },
  params: []
});
