var assert = require('assert');
var Table = require(__dirname + '/../lib/table');
var Column = require(__dirname + '/../lib/column');

var table = new Table({
  name: 'bang'
})

assert.equal(table.getName(), 'bang');
assert.equal(table.columns.length, 0);

var col = new Column({
  table: table,
  name: 'boom'
})

assert.equal(col.name, 'boom');
assert.equal(col.table.getName(), 'bang');

table.addColumn(col);
assert.equal(table.columns.length, 1);
assert.equal(table.boom, col);

console.log('table creates query node');
var sel = table.select(table.boom);
assert.equal(sel.type, 'QUERY');

console.log('table can be defined');
var user = Table.define({
  name: 'user',
  columns: ['id', 'name']
})

assert.equal(user.getName(), 'user');
assert.equal(user.columns.length, 2);
assert.equal(user.columns[0].name, 'id');
assert.equal(user.columns[1].name, 'name');
assert.equal(user.columns[0].name, user.id.name)
assert.equal(user.id.table, user);
assert.equal(user.name.table, user);

