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
        column: 'id',
        onDelete: 'restrict',
        onUpdate: 'set null'
      }
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`userId` int REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE SET NULL)',
    string: 'CREATE TABLE `post` (`userId` int REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE SET NULL)'
  },
  oracle: {
    text  : 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)',
    string: 'CREATE TABLE "post" ("userId" int REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE SET NULL)'
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

var users = Table.define({
  name: 'users',
  columns: {
    id: {
      primaryKey: true,
      dataType: 'int',
      references: {
        table: "entity",
        column: "id",
        constraint: "DEFERRABLE INITIALLY DEFERRED"
      }
    }
  }
});

Harness.test({
  query: users.create(),
  pg: {
    text: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)',
    string: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)'
  },
  sqlite: {
    text: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)',
    string: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)'
  },
  mysql: {
    text: 'CREATE TABLE `users` (`id` int PRIMARY KEY REFERENCES `entity`(`id`) DEFERRABLE INITIALLY DEFERRED)',
    string: 'CREATE TABLE `users` (`id` int PRIMARY KEY REFERENCES `entity`(`id`) DEFERRABLE INITIALLY DEFERRED)'
  },
  mssql: {
    text: 'CREATE TABLE [users] ([id] int PRIMARY KEY REFERENCES [entity]([id]) DEFERRABLE INITIALLY DEFERRED)',
    string: 'CREATE TABLE [users] ([id] int PRIMARY KEY REFERENCES [entity]([id]) DEFERRABLE INITIALLY DEFERRED)'
  },
  oracle: {
    text: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)',
    string: 'CREATE TABLE "users" ("id" int PRIMARY KEY REFERENCES "entity"("id") DEFERRABLE INITIALLY DEFERRED)'
  },
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


var noUsers = Table.define({
  name: 'no_users',
  columns: {
    id: {
      primaryKey: true,
      dataType: 'int',
      references: {
        table: "entity",
        column: "id",
        constraint: ""
      }
    }
  }
});

Harness.test({
  query: noUsers.create(),
  pg: {
    text  : 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))',
    string: 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))'
  },
  sqlite: {
    text  : 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))',
    string: 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))'
  },
  mysql: {
    text  : 'CREATE TABLE `no_users` (`id` int PRIMARY KEY REFERENCES `entity`(`id`))',
    string: 'CREATE TABLE `no_users` (`id` int PRIMARY KEY REFERENCES `entity`(`id`))'
  },
  mssql: {
    text  : 'CREATE TABLE [no_users] ([id] int PRIMARY KEY REFERENCES [entity]([id]))',
    string: 'CREATE TABLE [no_users] ([id] int PRIMARY KEY REFERENCES [entity]([id]))'
  },
  oracle: {
    text  : 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))',
    string: 'CREATE TABLE "no_users" ("id" int PRIMARY KEY REFERENCES "entity"("id"))'
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

Harness.test({
  query: Table.define({
    name: 'post',
    columns: [{
      name: 'id',
      dataType: 'int',
      primaryKey: true
    }, {
      name: 'blog_id',
      dataType: 'int'
    }, {
      name: 'user_id',
      dataType: 'int'
    }],
    foreignKeys: {
      table: 'users',
      columns: [ 'blog_id', 'user_id' ],
      refColumns: [ 'id', 'user_id' ]
    }
  }).create(),
  pg: {
    text  : 'CREATE TABLE "post" ("id" int PRIMARY KEY, "blog_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ( "id", "user_id" ))',
    string: 'CREATE TABLE "post" ("id" int PRIMARY KEY, "blog_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ( "id", "user_id" ))'
  },
  sqlite: {
    text  : 'CREATE TABLE "post" ("id" int PRIMARY KEY, "blog_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ( "id", "user_id" ))',
    string: 'CREATE TABLE "post" ("id" int PRIMARY KEY, "blog_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ( "id", "user_id" ))'
  },
  mysql: {
    text  : 'CREATE TABLE `post` (`id` int PRIMARY KEY, `blog_id` int, `user_id` int, FOREIGN KEY ( `blog_id`, `user_id` ) REFERENCES `users` ( `id`, `user_id` ))',
    string: 'CREATE TABLE `post` (`id` int PRIMARY KEY, `blog_id` int, `user_id` int, FOREIGN KEY ( `blog_id`, `user_id` ) REFERENCES `users` ( `id`, `user_id` ))'
  },
  params: []
});

Harness.test({
  query: Table.define({
    name: 'replies',
    columns: [{
      name: 'id',
      dataType: 'int',
      primaryKey: true
    }, {
      name: 'blog_id',
      dataType: 'int'
    }, {
      name: 'post_id',
      dataType: 'int'
    }, {
      name: 'user_id',
      dataType: 'int'
    }],
    foreignKeys: [{
      table: 'users',
      columns: [ 'blog_id', 'user_id' ],
      onDelete: 'no action'
    }, {
      name: 'posts_idx',
      table: 'posts',
      columns: [ 'blog_id', 'post_id' ],
      refColumns: [ 'blog_id', 'id' ],
      onDelete: 'cascade',
      onUpdate: 'set default'
    }]
  }).create(),
  pg: {
    text  : 'CREATE TABLE "replies" ("id" int PRIMARY KEY, "blog_id" int, "post_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ON DELETE NO ACTION, CONSTRAINT "posts_idx" FOREIGN KEY ( "blog_id", "post_id" ) REFERENCES "posts" ( "blog_id", "id" ) ON DELETE CASCADE ON UPDATE SET DEFAULT)',
    string: 'CREATE TABLE "replies" ("id" int PRIMARY KEY, "blog_id" int, "post_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ON DELETE NO ACTION, CONSTRAINT "posts_idx" FOREIGN KEY ( "blog_id", "post_id" ) REFERENCES "posts" ( "blog_id", "id" ) ON DELETE CASCADE ON UPDATE SET DEFAULT)'
  },
  sqlite: {
    text  : 'CREATE TABLE "replies" ("id" int PRIMARY KEY, "blog_id" int, "post_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ON DELETE NO ACTION, CONSTRAINT "posts_idx" FOREIGN KEY ( "blog_id", "post_id" ) REFERENCES "posts" ( "blog_id", "id" ) ON DELETE CASCADE ON UPDATE SET DEFAULT)',
    string: 'CREATE TABLE "replies" ("id" int PRIMARY KEY, "blog_id" int, "post_id" int, "user_id" int, FOREIGN KEY ( "blog_id", "user_id" ) REFERENCES "users" ON DELETE NO ACTION, CONSTRAINT "posts_idx" FOREIGN KEY ( "blog_id", "post_id" ) REFERENCES "posts" ( "blog_id", "id" ) ON DELETE CASCADE ON UPDATE SET DEFAULT)'
  },
  mysql: {
    text  : 'CREATE TABLE `replies` (`id` int PRIMARY KEY, `blog_id` int, `post_id` int, `user_id` int, FOREIGN KEY ( `blog_id`, `user_id` ) REFERENCES `users` ON DELETE NO ACTION, CONSTRAINT `posts_idx` FOREIGN KEY ( `blog_id`, `post_id` ) REFERENCES `posts` ( `blog_id`, `id` ) ON DELETE CASCADE ON UPDATE SET DEFAULT)',
    string: 'CREATE TABLE `replies` (`id` int PRIMARY KEY, `blog_id` int, `post_id` int, `user_id` int, FOREIGN KEY ( `blog_id`, `user_id` ) REFERENCES `users` ON DELETE NO ACTION, CONSTRAINT `posts_idx` FOREIGN KEY ( `blog_id`, `post_id` ) REFERENCES `posts` ( `blog_id`, `id` ) ON DELETE CASCADE ON UPDATE SET DEFAULT)'
  },
  params: []
});
