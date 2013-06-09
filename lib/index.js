'use strict';

var _ = require('lodash');
var Query = require(__dirname + '/node/query');
var Table = require(__dirname + '/table');

// default dialect is postgres
var DEFAULT_DIALECT = 'postgres';

var Sql = function(dialect) {
  dialect = dialect || DEFAULT_DIALECT;

  this.setDialect(dialect);
};

Sql.prototype.define = function(def) {
  def = _.defaults(def || {}, {
    sql: this
  });

  return Table.define(def);
};

Sql.prototype.select = function() {
  var query = new Query({sql: this});
  query.select.apply(query, arguments);
  return query;
};

Sql.prototype.setDialect = function(dialect) {
  switch(dialect.toLowerCase()) {
    case 'postgres':
      this.dialect = require(__dirname + '/dialect/postgres');
      break;
    case 'mysql':
      this.dialect = require(__dirname + '/dialect/mysql');
    break;
    case 'sqlite':
      this.dialect = require(__dirname + '/dialect/sqlite');
    break;
    default:
      throw new Error(dialect + ' is unsupported');
  }
  return this;
};

// back compat shim for the Sql class constructor
var create = function(dialect) {
  return new Sql(dialect);
};

module.exports = new Sql('postgres');
module.exports.create = create;
module.exports.Sql = Sql;
module.exports.Table = Table;
