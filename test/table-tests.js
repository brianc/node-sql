'use strict';

var test = require('tap').test;
var Table = require(__dirname + '/../lib/table');
var Column = require(__dirname + '/../lib/column');

test('table', function(t) {
  var table = new Table({
    name: 'bang'
  });

  t.equal(table.getName(), 'bang');
  t.equal(table.columns.length, 0);

  var col = new Column({
    table: table,
    name: 'boom'
  });

  t.equal(col.name, 'boom');
  t.equal(col.table.getName(), 'bang');

  table.addColumn(col);
  t.equal(table.columns.length, 1);
  t.equal(table.boom, col);

  console.log('table creates query node');
  var sel = table.select(table.boom);
  t.equal(sel.type, 'QUERY');

  console.log('table can be defined');
  var user = Table.define({
    name: 'user',
    columns: ['id', 'name']
  });

  t.equal(user.getName(), 'user');
  t.equal(user.columns.length, 2);
  t.equal(user.columns[0].name, 'id');
  t.equal(user.columns[1].name, 'name');
  t.equal(user.columns[0].name, user.id.name);
  t.equal(user.id.table, user);
  t.equal(user.name.table, user);
  t.end();
});

test('table with fancier column definitions', function(t) {
  var table = Table.define({
    name: 'blah',
    columns: [{
      name: 'id',
      type: 'serial',
      notNull: true,
      primaryKey: true
    }, {
      name: 'email',
      type: 'text',
      notNull: true,
      unique: true,
      anythingYouWant: 'awesome'
    }]
  });
  var cols = table.columns;
  t.equals(cols.length, 2);
  var id = cols[0];
  t.equals(id.name, 'id');
  t.equals(id.type, 'serial');
  t.equals(id.notNull, true);
  t.equals(id.primaryKey, true);
  var email = cols[1];
  t.equals(email.name, 'email');
  t.equals(email.type, 'text');
  t.equals(email.notNull, true);
  t.equals(email.unique, true);
  t.equals(email.anythingYouWant, 'awesome');
  t.end();
});
