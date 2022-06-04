'use strict';

var util = require('util');
var lodash = require('lodash');

var Query = require('./node/query');
var Column = require('./column');
var TableNode = require('./node/table');
var JoinNode = require('./node/join');
var LiteralNode = require('./node/literal');
var Joiner = require('./joiner');
var ForeignKeyNode = require('./node/foreignKey');

var Table = function(config) {
  this._schema = config.schema;
  this._name = config.name;
  this._initialConfig = config;
  this.columnWhiteList = !!config.columnWhiteList;
  this.isTemporary=!!config.isTemporary;
  this.snakeToCamel = !!config.snakeToCamel;
  this.columns = [];
  this.foreignKeys = [];
  this.table = this;
  if (!config.sql) {
    config.sql = require('./index');
  }
  this.sql = config.sql;
};

Table.define = function(config) {
  var table = new Table(config);
  // allow hash of columns as well as array
  if (config.columns && !util.isArray(config.columns)) {
    var cols = [];

    for (var key in config.columns) {
      if (config.columns.hasOwnProperty(key)) {
        var col = config.columns[key];
        col.name = key;
        cols.push(col);
      }
    }

    config.columns = cols;
  }

  for (var i = 0; i < config.columns.length; i++) {
    table.addColumn(config.columns[i]);
  }

  if(config.foreignKeys !== undefined) {
    if(util.isArray(config.foreignKeys)) {
      for(i = 0; i < config.foreignKeys.length; i++) {
        table.foreignKeys.push(new ForeignKeyNode(config.foreignKeys[i]));
      }
    } else {
      table.foreignKeys.push(new ForeignKeyNode(config.foreignKeys));
    }
  }
  return table;
};

Table.prototype.clone = function(config) {
  return Table.define(lodash.extend({
    schema: this._schema,
    name: this._name,
    sql: this.sql,
    columnWhiteList: !!this.columnWhiteList,
    snakeToCamel: !!this.snakeToCamel,
    columns: this.columns,
    foreignKeys: this.foreignKeys
  }, config || {}));
};

Table.prototype.createColumn = function(col) {
  if(!(col instanceof Column)) {
    if(typeof col === 'string') {
      col = { name: col };
    }

    col.table = this;
    col = new Column(col);

    // Load subfields from array into an object of form name: Column
    if(util.isArray(col.subfields)) {
      col.subfields = lodash.chain(col.subfields)
        .map(lodash.bind(function (subfield) {
          return [subfield, new Column({
            table: this,
            subfieldContainer: col,
            name: subfield
          })];
        }, this))
        .fromPairs()
        .value();
    }
  }

  return col;
};

Table.prototype.addColumn = function(col, options) {
  col     = this.createColumn(col);
  options = lodash.extend({
    noisy: true
  }, options || {});

  if(this.hasColumn(col)) {
    if (options.noisy) {
      throw new Error('Table ' + this._name + ' already has column or property by the name of ' + col.name);
    } else {
      return this;
    }
  } else if(!!this[col.name] && (process.env.NODE_ENV === 'debug')) {
    console.log('Please notice that you have just defined the column "' + col.name + '". In order to access it, you need to use "table.getColumn(\'' + col.name + '\');"!');
  }
  this.columns.push(col);

  function snakeToCamel(snakeName) {
    return snakeName.replace(/[\-_]([a-z])/g, function(m, $1){ return $1.toUpperCase(); });
  }

  var property = col.property = col.property || (this.snakeToCamel ? snakeToCamel(col.name) : col.name);
  this[property] = this[property] || col;
  return this;
};

Table.prototype.hasColumn = function(col) {
  var columnName = col instanceof Column ? col.name : col;
  return this.columns.some(function(column) {
    return column.property === columnName || column.name === columnName;
  });
};

Table.prototype.getColumn =
Table.prototype.get =
function(colName) {
  for(var i = 0; i < this.columns.length; i++) {
    var col = this.columns[i];
    if (colName === col.property || colName === col.name) {
      return col;
    }
  }
  if(this.columnWhiteList)
    return null;
  throw new Error('Table ' + this._name + ' does not have a column or property named ' + colName);
};

Table.prototype.getSchema = function() {
  return this._schema;
};

Table.prototype.setSchema = function(schema) {
  this._schema = schema;
};

Table.prototype.getName = function() {
  if (this.sql && this.sql.dialectName=="mssql" && this.isTemporary) return "#"+this._name;
  return this._name;
};

Table.prototype.star = function(options) {
  options = options || {};
  if (options.prefix) {
    return this.columns.map(function(column) {
      return this[column.name].as(options.prefix + column.name);
    }.bind(this));
  }

  return new Column({table: this, star: true});
};

Table.prototype.literal = function(literal) {
  return new LiteralNode(literal);
};

Table.prototype.count = function(alias) {
  var name = this.alias || this._name,
    col = new Column({table: this, star: true});
  // ColumnNode
  return col.count(alias || name + '_count');
};

Table.prototype.select = function() {
  // create the query and pass it off
  var query = new Query(this);
  if (arguments.length === 0) {
    query.select.call(query, this.star());
  } else {
    query.select.apply(query, arguments);
  }
  return query;
};

Table.prototype.subQuery = function(alias) {
  // create the query and pass it off
  var query = new Query(this);
  query.type = 'SUBQUERY';
  query.alias = alias;
  query.join = function(other) {
    return new JoinNode('INNER', this.toNode(), other.toNode(), other);
  };
  return query;
};

Table.prototype.insert = function() {
  var query = new Query(this);
  if(!arguments[0] || (util.isArray(arguments[0]) && arguments[0].length === 0)){
    query.select.call(query, this.star());
    query.where.apply(query,["1=2"]);
  } else {
    query.insert.apply(query, arguments);
  }
  return query;
};

Table.prototype.replace = function() {
  var query = new Query(this);
  if(!arguments[0] || (util.isArray(arguments[0]) && arguments[0].length === 0)){
    query.select.call(query, this.star());
    query.where.apply(query,["1=2"]);
  } else {
    query.replace.apply(query, arguments);
  }
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

Table.prototype.leftJoinLateral = function(other) {
  return new JoinNode('LEFT LATERAL', this.toNode(), other.toNode());
};

// auto-join tables based on column intropsection
Table.prototype.joinTo = function(other) {
  return Joiner.leftJoin(this, other);
};

Table.prototype.as = function(alias) {
  // TODO could this be cleaner?
  var t = Table.define(this._initialConfig);
  t.alias = alias;
  return t;
};

// called in shorthand when not calling select
Table.prototype.__defineGetter__("nodes", function() {
  return this.select(this.star()).nodes;
});

Table.prototype.and = function() {
  var query = new Query(this);
  query.where.apply(query, arguments);
  return query;
};

Table.prototype.indexes = function() {
  return new Query(this).indexes();
};

var queryMethods = [
  'alter',
  'create',
  'delete',
  'drop',
  'from',
  'limit',
  'offset',
  'or',
  'order',
  'truncate',
  'update',
  'where'
];

queryMethods.forEach(function (method) {
  Table.prototype[method] = function () {
    var query = new Query(this);
    query[method].apply(query, arguments);
    return query;
  };
});

module.exports = Table;
