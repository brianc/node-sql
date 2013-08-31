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
  });

  test('creates query node', function() {
    var sel = table.select(table.boom);
    assert.equal(sel.type, 'QUERY');
  });

  test('creates *-query if no args is provided to select()', function() {
    var sel = table.select();
    assert.ok(sel.nodes[0].nodes[0].star);
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

test('table with user-defined column property names', function () {
  var table = Table.define({
    name: 'blah',
    columns: [{
        name: 'id',
        property: 'theId'
      }, {
        name: 'email',
        property: 'uniqueEmail'
      }]
  });
  var cols = table.columns;
  assert.equal(cols.length, 2);
  assert.equal(cols[0].name, 'id');
  assert(cols[0] === table.theId, 'Expected table.theId to be the first column');
  assert(table.id === undefined, 'Expected table.id to not exist');
  assert.equal(cols[1].name, 'email');
  assert(cols[1] === table.uniqueEmail, 'Expected table.uniqueEmail to be the second column');
  assert(table.email === undefined, 'Expected table.email to not exist');
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

test('table with object structured column definitions', function() {
  var table = Table.define({
    name: 'blah',
    columns: {
      id: {
        type: 'serial',
        notNull: true,
        primaryKey: true
      },
      email: {
        type: 'text',
        notNull: true,
        unique: true,
        anythingYouWant: 'awesome'
      }
    }
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

test('table with dynamic column definition', function() {
  var table = Table.define({ name: 'foo', columns: [] });
  assert.equal(table.columns.length, 0);

  table.addColumn('foo');
  assert.equal(table.columns.length, 1);

  assert.throws(function() {
    table.addColumn('foo');
  });

  assert.doesNotThrow(function() {
    table.addColumn('foo', { noisy: false });
  });

  assert.equal(table.columns.length, 1);
});

test('hasColumn', function() {
  var table = Table.define({ name: 'foo', columns: [] });

  assert.equal(table.hasColumn('baz'), false);
  table.addColumn('baz');
  assert.equal(table.hasColumn('baz'), true);
});

test('the column "from" does not overwrite the from method', function() {
  var table = Table.define({ name: 'foo', columns: [] });
  table.addColumn('from');
  assert.equal(typeof table.from, 'function');
});

test('getColumn returns the from column', function() {
  var table = Table.define({ name: 'foo', columns: [] });
  table.addColumn('from');
  assert(table.getColumn('from') instanceof Column);
  assert(table.get('from') instanceof Column);
});

test('set and get schema', function () {
  var table = Table.define({ name: 'foo', schema: 'bar', columns: [] });
  assert.equal(table.getSchema(), 'bar');
  table.setSchema('barbarz');
  assert.equal(table.getSchema(), 'barbarz');
});