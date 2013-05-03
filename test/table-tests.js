'use strict';
var assert = require('assert');

var Table = require(__dirname + '/../lib/table');
var Column = require(__dirname + '/../lib/column');

suite('table', function() {
  var table = new Table({
    name: 'bang'
  });

  test('has name', function() {
    assert.equal(table.getName(), 'bang');
  });

  test('has no columns', function() {
    assert.equal(table.columns.length, 0);
  });

  test('can add column', function() {
    
    var col = new Column({
      table: table,
      name: 'boom'
    });

    assert.equal(col.name, 'boom');
    assert.equal(col.table.getName(), 'bang');

    table.addColumn(col);
    assert.equal(table.columns.length, 1);
    assert.equal(table.boom, col);
  })

  test('creates query node', function() {
    var sel = table.select(table.boom);
    assert.equal(sel.type, 'QUERY');
  });

  test('can be defined', function() {
    var user = Table.define({
      name: 'user',
      columns: ['id', 'name']
    });
    assert.equal(user.getName(), 'user');
    assert.equal(user.columns.length, 2);
    assert.equal(user.columns[0].name, 'id');
    assert.equal(user.columns[1].name, 'name');
    assert.equal(user.columns[0].name, user.id.name);
    assert.equal(user.id.table, user);
    assert.equal(user.name.table, user);
  });
});

test('table with fancier column definitions', function() {
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
  assert.equal(cols.length, 2);
  var id = cols[0];
  assert.equal(id.name, 'id');
  assert.equal(id.type, 'serial');
  assert.equal(id.notNull, true);
  assert.equal(id.primaryKey, true);
  var email = cols[1];
  assert.equal(email.name, 'email');
  assert.equal(email.type, 'text');
  assert.equal(email.notNull, true);
  assert.equal(email.unique, true);
  assert.equal(email.anythingYouWant, 'awesome');
});
