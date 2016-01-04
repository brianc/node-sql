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
  mssql: {
    text  : 'CREATE TABLE [group] ([id] varchar(100), [user_id] varchar(100))',
    string: 'CREATE TABLE [group] ([id] varchar(100), [user_id] varchar(100))'
  },
  oracle: {
    text  : 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))',
    string: 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))'
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
  mssql: {
    text  : 'IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = \'group\') BEGIN CREATE TABLE [group] ([id] varchar(100), [user_id] varchar(100)) END',
    string: 'IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = \'group\') BEGIN CREATE TABLE [group] ([id] varchar(100), [user_id] varchar(100)) END'
  },
  oracle: {
    text  : 'BEGIN EXECUTE IMMEDIATE \'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))\'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF; END;',
    string: 'BEGIN EXECUTE IMMEDIATE \'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))\'; EXCEPTION WHEN OTHERS THEN IF SQLCODE != -955 THEN RAISE; END IF; END;'
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
  },
  mssql: {
    text  : 'CREATE TABLE [user] ([id] varchar(100))',
    string: 'CREATE TABLE [user] ([id] varchar(100))'
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
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
  },
  mssql: {
    text  : 'CREATE TABLE [user] ([id] varchar(100))',
    string: 'CREATE TABLE [user] ([id] varchar(100))'
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
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
  },
  mssql: {
    text  : 'CREATE TABLE [user] ([id] varchar(100))',
    string: 'CREATE TABLE [user] ([id] varchar(100))'
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" varchar(100))',
    string: 'CREATE TABLE "user" ("id" varchar(100))'
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
  },
  mssql: {
    text  : 'CREATE TABLE [user] ([id] int PRIMARY KEY)',
    string: 'CREATE TABLE [user] ([id] int PRIMARY KEY)'
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "user" ("id" int PRIMARY KEY)'
  }
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
      name: 'id',
      dataType: 'int',
      notNull: true
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "user" ("id" int NOT NULL)',
    string: 'CREATE TABLE "user" ("id" int NOT NULL)'
  },
  sqlite: {
    text  : 'CREATE TABLE "user" ("id" int NOT NULL)',
    string: 'CREATE TABLE "user" ("id" int NOT NULL)'
  },
  mysql: {
    text  : 'CREATE TABLE `user` (`id` int NOT NULL)',
    string: 'CREATE TABLE `user` (`id` int NOT NULL)'
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" int NOT NULL)',
    string: 'CREATE TABLE "user" ("id" int NOT NULL)'
  }
});

Harness.test({
  query: Table.define({
    name: 'user',
    columns: [{
      name: 'id',
      dataType: 'int',
      primaryKey: true,
      notNull: true
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
  },
  oracle: {
    text  : 'CREATE TABLE "user" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "user" ("id" int PRIMARY KEY)'
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
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`userId` int REFERENCES `user`(`id`))',
    string: 'CREATE TABLE `post` (`userId` int REFERENCES `user`(`id`))'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id"))'
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
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))'
  },
  sqlite: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))'
  },
  mysql: {
    text  : 'CREATE TABLE `picture` (`userId` int REFERENCES `user`(`id`), `caption` varchar(100))',
    string: 'CREATE TABLE `picture` (`userId` int REFERENCES `user`(`id`), `caption` varchar(100))'
  },
  oracle: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id"), "caption" varchar(100))'
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
      column: 'id',
      onDelete: 'cascade'
    }
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)'
  },
  sqlite: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)'
  },
  mysql: {
    text  : 'CREATE TABLE `picture` (`userId` int REFERENCES `user`(`id`) ON DELETE CASCADE)',
    string: 'CREATE TABLE `picture` (`userId` int REFERENCES `user`(`id`) ON DELETE CASCADE)'
  },
  oracle: {
    text  : 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)',
    string: 'CREATE TABLE "picture" ("userId" int REFERENCES "user"("id") ON DELETE CASCADE)'
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
  oracle: {
    text  : 'references is not a object for column userId (REFERENCES statements within CREATE TABLE and ADD COLUMN statements require refrences to be expressed as an object)',
    throws: true
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'membership',
    columns: {
      group_id: { dataType: 'int', primaryKey: true},
      user_id:  { dataType: 'int', primaryKey: true},
      desc:  { dataType: 'varchar'}
    }
  }).create(),
  pg: {
    text  : 'CREATE TABLE "membership" ("group_id" int, "user_id" int, "desc" varchar, PRIMARY KEY ("group_id", "user_id"))',
    string: 'CREATE TABLE "membership" ("group_id" int, "user_id" int, "desc" varchar, PRIMARY KEY ("group_id", "user_id"))',
  },
  sqlite: {
    text  : 'CREATE TABLE "membership" ("group_id" int, "user_id" int, "desc" varchar, PRIMARY KEY ("group_id", "user_id"))',
    string: 'CREATE TABLE "membership" ("group_id" int, "user_id" int, "desc" varchar, PRIMARY KEY ("group_id", "user_id"))',
  },
  mysql: {
    text  : 'CREATE TABLE `membership` (`group_id` int, `user_id` int, `desc` varchar, PRIMARY KEY (`group_id`, `user_id`))',
    string: 'CREATE TABLE `membership` (`group_id` int, `user_id` int, `desc` varchar, PRIMARY KEY (`group_id`, `user_id`))',
  }
});

// TEMPORARY TABLE TESTS

// This tests explicitly setting the isTemporary flag to false, as opposed to all the test above here which have it
// as undefined.
Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
        name: 'id',
        dataType: 'int'
      }],
    isTemporary:false
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("id" int)',
    string: 'CREATE TABLE "post" ("id" int)'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("id" int)',
    string: 'CREATE TABLE "post" ("id" int)'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`id` int)',
    string: 'CREATE TABLE `post` (`id` int)'
  },
  mssql: {
    text  : 'CREATE TABLE [post] ([id] int)',
    string: 'CREATE TABLE [post] ([id] int)'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("id" int)',
    string: 'CREATE TABLE "post" ("id" int)'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
        name: 'id',
        dataType: 'int'
      }],
    isTemporary:true
  }).create(),
  pg: {
    text  : 'CREATE TEMPORARY TABLE "post" ("id" int)',
    string: 'CREATE TEMPORARY TABLE "post" ("id" int)'
  },
  sqlite: {
    text  : 'CREATE TEMPORARY TABLE "post" ("id" int)',
    string: 'CREATE TEMPORARY TABLE "post" ("id" int)'
  },
  mysql: {
    text  : 'CREATE TEMPORARY TABLE `post` (`id` int)',
    string: 'CREATE TEMPORARY TABLE `post` (`id` int)'
  },
  //mssql: {
  //  text  : 'CREATE TABLE [#post] ([id] int)',
  //  string: 'CREATE TABLE [#post] ([id] int)'
  //},
  params: []
});

// UNIQUE COLUMN TESTS
Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'id',
      dataType: 'int',
      //primaryKey: true,
      //notNull: true,
      unique: true
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("id" int UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int UNIQUE)'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("id" int UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int UNIQUE)'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`id` int UNIQUE)',
    string: 'CREATE TABLE `post` (`id` int UNIQUE)'
  },
  mssql: {
    text  : 'CREATE TABLE [post] ([id] int UNIQUE)',
    string: 'CREATE TABLE [post] ([id] int UNIQUE)'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("id" int UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int UNIQUE)'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'id',
      dataType: 'int',
      //primaryKey: true,
      notNull: true,
      unique: true
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`id` int NOT NULL UNIQUE)',
    string: 'CREATE TABLE `post` (`id` int NOT NULL UNIQUE)'
  },
  mssql: {
    text  : 'CREATE TABLE [post] ([id] int NOT NULL UNIQUE)',
    string: 'CREATE TABLE [post] ([id] int NOT NULL UNIQUE)'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)',
    string: 'CREATE TABLE "post" ("id" int NOT NULL UNIQUE)'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'id',
      dataType: 'int',
      primaryKey: true,
      //notNull: true,
      unique: true
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "post" ("id" int PRIMARY KEY)'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "post" ("id" int PRIMARY KEY)'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`id` int PRIMARY KEY)',
    string: 'CREATE TABLE `post` (`id` int PRIMARY KEY)'
  },
  mssql: {
    text  : 'CREATE TABLE [post] ([id] int PRIMARY KEY)',
    string: 'CREATE TABLE [post] ([id] int PRIMARY KEY)'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("id" int PRIMARY KEY)',
    string: 'CREATE TABLE "post" ("id" int PRIMARY KEY)'
  },
  params: []
});
