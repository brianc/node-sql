var Harness = require('./support');
var user = Harness.defineUserTable();

Harness.test({
  query: user.insert({name: 'joe'}).returning(),
  pg: {
    text  : 'INSERT INTO "user" ("name") VALUES ($1) RETURNING *',
    string: 'INSERT INTO "user" ("name") VALUES (\'joe\') RETURNING *'
  },
  params: ['joe']
});

Harness.test({
  query: user.insert({name: 'joe'}).returning('id'),
  pg: {
    text  : 'INSERT INTO "user" ("name") VALUES ($1) RETURNING id',
    string: 'INSERT INTO "user" ("name") VALUES (\'joe\') RETURNING id'
  },
  params: ['joe']
});
