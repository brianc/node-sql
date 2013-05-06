'use strict';

var Query = require(__dirname + '/node/query');
var Column = require(__dirname + '/column');
var TableNode = require(__dirname + '/node/table');
var JoinNode = require(__dirname + '/node/join');

var Table = function(config) {
  this._schema = config.schema;
  this._name = config.name;
  this._initialConfig = config;
  this.columns = [];
  this.table = this;
};

Table.define = function(config) {
  var table = new Table(config);
  for (var i = 0; i < config.columns.length; i++) {
    var col = config.columns[i];
    if(typeof col === 'string') {
      col = { name: col };
    }
    col.table = table;
    col = new Column(col);
    table.addColumn(col);
  }
  return table;
};

Table.prototype.addColumn = function(col) {
  this.columns.push(col);
  if(this[col.name]) {
    throw new Error('Table ' + this._name + ' already has column or property by the name of ' + col.name);
  }
  this[col.name] = col;
  return this;
};

Table.prototype.getColumn = function(colName) {
  var col = this[colName];
  if(!col) {
    throw new Error('Table ' + this._name + ' does not have a column named ' + colName);
  }
  return col;
};

Table.prototype.getSchema = function() {
  return this._schema;
};

Table.prototype.getName = function() {
  return this._name;
};

Table.prototype.star = function() {
  return new Column({table: this, star: true});
};

Table.prototype.count = function(alias) {
  var name = this.alias || this._name,
    col = new Column({table: this, star: true});
  return col.count(alias || name + '_count'); //ColumnNode
};

Table.prototype.select = function() {
  //create the query and pass it off
  var query = new Query(this);
  query.select.apply(query, arguments);
  return query;
};

Table.prototype.from = function() {
  var query = new Query(this);
  query.from.apply(query, arguments);
  return query;
};

Table.prototype.subQuery = function(alias) {
  //create the query and pass it off
  var query = new Query(this);
  query.type = 'SUBQUERY';
  query.alias = alias;
  return query;
};

Table.prototype.insert = function() {
  var query = new Query(this);
  query.insert.apply(query, arguments);
  return query;
};

Table.prototype.update = function() {
  var query = new Query(this);
  query.update.apply(query, arguments);
  return query;
};

Table.prototype['delete'] = function() {
  var query = new Query(this);
  query['delete'].apply(query, arguments);
  return query;
};

Table.prototype.create = function() {
  var query = new Query(this);
  query.create.apply(query, arguments);
  return query;
};

Table.prototype.drop = function() {
  var query = new Query(this);
  query.drop.apply(query, arguments);
  return query;
};

Table.prototype.alter = function() {
  var query = new Query(this);
  query.alter.apply(query, arguments);
  return query;
};

Table.prototype.toNode = function() {
  return new TableNode(this);
};

Table.prototype.join = function(other) {
  return new JoinNode('INNER', this.toNode(), other.toNode(), other);
};

Table.prototype.leftJoin = function(other) {
  return new JoinNode('LEFT', this.toNode(), other.toNode());
};

Table.prototype.as = function(alias) {
  //TODO could this be cleaner?
  var t = Table.define(this._initialConfig);
  t.alias = alias;
  return t;
};

//called in shorthand when not calling select
Table.prototype.__defineGetter__("nodes", function() {
  return this.select(this.star()).nodes;
});

Table.prototype.where = function() {
  var query = new Query(this);
  query.where.apply(query, arguments);
  return query;
};

Table.prototype.and = function() {
  var query = new Query(this);
  query.where.apply(query, arguments);
  return query;
};

Table.prototype.or = function() {
  var query = new Query(this);
  query.or.apply(query, arguments);
  return query;
};

module.exports = Table;
