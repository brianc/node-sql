'use strict';

var _            = require('lodash');
var FunctionCall = require('./node/functionCall');
var ArrayCall    = require('./node/arrayCall');
var functions    = require('./functions');
var getDialect   = require('./dialect');
var Query        = require('./node/query');
var sliced       = require('sliced');
var Table        = require('./table');

// default dialect is postgres
var DEFAULT_DIALECT = 'postgres';

var Sql = function(dialect) {
  this.setDialect(dialect || DEFAULT_DIALECT);

  // attach the standard SQL functions to this instance
  this.functions = functions.getStandardFunctions(this);
};

// Define a table
Sql.prototype.define = function(def) {
  def = _.defaults(def || {}, {
    sql: this
  });

  return Table.define(def);
};

// Returns a function call creator
Sql.prototype.functionCallCreator = function(name) {
  var sql = this;
  return function() {
    var functionCall = new FunctionCall(name, sliced(arguments));
    functionCall.sql = sql;
    return functionCall;
  };
};

// Returns a bracketed call creator literal
Sql.prototype.array = function() {
  var arrayCall = new ArrayCall(sliced(arguments));
  arrayCall.sql = this;
  return arrayCall;
};

// Returns a select statement
Sql.prototype.select = function() {
  var query = new Query({sql: this});
  query.select.apply(query, arguments);
  return query;
};

// Set the dialect
Sql.prototype.setDialect = function(dialect) {
  this.dialect     = getDialect(dialect);
  this.dialectName = dialect;

  return this;
};

// back compat shim for the Sql class constructor
var create = function(dialect) {
  return new Sql(dialect);
};

module.exports = new Sql(DEFAULT_DIALECT);
module.exports.create = create;
module.exports.Sql = Sql;
module.exports.Table = Table;
