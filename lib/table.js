var Query = require(__dirname + '/node/query');
var Column = require(__dirname + '/column');
var TableNode = require(__dirname + '/node/table');
var TextNode = require(__dirname + '/node/text');
var JoinNode = require(__dirname + '/node/join');

var Table = function(config) {
  this._name = config.name;
  this._initialConfig = config;
  this.quote = config.quote || false;
  this.columns = [];
}

Table.define = function(config) {
  var table = new Table(config);
  for (var i = 0; i < config.columns.length; i++) {
    var col = config.columns[i];
    if(typeof col === 'string') {
      col = { name: col }
    }
    col.table = table;
    var col = new Column(col);
    table.addColumn(col);
  };
  return table;
}

Table.prototype.addColumn = function(col) {
  this.columns.push(col);
  if(this[col.name]) {
    throw new Error('Table ' + this._name + ' already has column or property by the name of ' + col.name);
  }
  this[col.name] = col;
  return this;
}

Table.prototype.getName = function() {
  return this._name;
}

Table.prototype.star = function() {
  return new TextNode('"'+this._name+'".*');
}

Table.prototype.select = function() {
  //create the query and pass it off
  var query = new Query(this);
  query.select.apply(query, arguments);
  return query;
}

Table.prototype.insert = function() {
  var query = new Query(this);
  query.insert.apply(query, arguments);
  return query;
}

Table.prototype.update = function() {
  var query = new Query(this);
  query.update.apply(query, arguments);
  return query;
}

Table.prototype.toNode = function() {
  return new TableNode(this);
}

Table.prototype.join = function(other) {
  return new JoinNode('INNER', this.toNode(), other.toNode());
}

Table.prototype.as = function(alias) {
  //TODO could this be cleaner?
  var t = Table.define(this._initialConfig);
  t.alias = alias;
  return t;
}

module.exports = Table;
