'use strict';

var _            = require('lodash');
var Column 		 = require("./column");
var FunctionCall = require('./node/functionCall');
var ArrayCall    = require('./node/arrayCall');
var functions    = require('./functions');
var getDialect   = require('./dialect');
var Query        = require('./node/query');
var sliced       = require('sliced');
var Table        = require('./table');
var Interval     = require('./node/interval');

// default dialect is postgres
var DEFAULT_DIALECT = 'postgres';

var Sql = function(dialect, config) {
  this.setDialect(dialect || DEFAULT_DIALECT, config);

  // attach the standard SQL functions to this instance
  this.functions = functions.getStandardFunctions();
  this.function = functions.getFunctions;
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
  return function() {
    return new FunctionCall(name, sliced(arguments));
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

// Returns an interval clause
Sql.prototype.interval = function() {
  var interval = new Interval(sliced(arguments));
  return interval;
};

// Set the dialect
Sql.prototype.setDialect = function(dialect, config) {
  this.dialect     = getDialect(dialect);
  this.dialectName = dialect;
  this.config      = config;

  return this;
};

// Create a constant Column (for use in SELECT)
Sql.prototype.constant = function(value) {
  var config={
    name:"constant",
    property:"constant",
    isConstant:true,
    constantValue:value,
  };
  var cn = new Column(config);
  return cn;
};


// back compat shim for the Sql class constructor
var create = function(dialect, config) {
  return new Sql(dialect, {});
};

module.exports = new Sql(DEFAULT_DIALECT, {});
module.exports.create = create;
module.exports.Sql = Sql;
module.exports.Table = Table;
