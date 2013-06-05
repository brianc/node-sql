'use strict';

var _ = require('lodash');
var FunctionCall = require(__dirname + '/node/functionCall');
var functions = require(__dirname + '/functions');
var Query = require(__dirname + '/node/query');
var Table = require(__dirname + '/table');

// default dialect is postgres
var DEFAULT_DIALECT = 'postgres';

var Sql = function(dialect) {
  dialect = dialect || DEFAULT_DIALECT;

  this.setDialect(dialect);

  // attach the standard functions to this instance
  this.functions = functions.getFunctions(this);
};

// Define a table
Sql.prototype.define = function(def) {
  def = _.defaults(def || {}, {
    sql: this
  });

  return Table.define(def);
};

// Define a function call
Sql.prototype.functionCall = function() {
  var functionCall = new FunctionCall(_.head(arguments), _.rest(arguments));
  functionCall.sql = this;
  return functionCall;
};

// Define a select statement
Sql.prototype.select = function() {
  var query = new Query({sql: this});
  query.select.apply(query, arguments);
  return query;
};

// Set the dialect
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
