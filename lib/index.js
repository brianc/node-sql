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

/**
 * @constructor
 * @param {string} [dialect=postgres] - the SQL dialect to use [postgres|mysql|sqlite|mssql|oracle]
 * @param {Object} config
 * @param {bool=} config.questionMarkParameterPlaceholder
 * @param {string=} config.nullOrder [FIRST|LAST]
 * @param {bool=} config.dateTimeMillis
 */
var Sql = function(dialect, config) {
  this.setDialect(dialect || DEFAULT_DIALECT, config);

  // attach the standard SQL functions to this instance
  this.functions = functions.getStandardFunctions();
};

/**
 * Define a table
 * @param {{name: string, column: string[]}} def
 *
 * @returns {Table}
 */
Sql.prototype.define = function(def) {
  def = _.defaults(def || {}, {
    sql: this
  });

  return Table.define(def);
};

/**
 * Returns a function call creator
 * @param {string} name
 *
 * @returns {FunctionCall}
 */
Sql.prototype.functionCallCreator = function(name) {
  return function() {
    return new FunctionCall(name, sliced(arguments));
  };
};

/**
 * Returns a bracketed call creator literal
 *
 * @returns {ArrayCall}
 */
Sql.prototype.array = function() {
  var arrayCall = new ArrayCall(sliced(arguments));
  arrayCall.sql = this;
  return arrayCall;
};

/**
 * Returns a select statement
 *
 * @returns {Query}
 */
Sql.prototype.select = function() {
  var query = new Query({sql: this});
  query.select.apply(query, arguments);
  return query;
};

/**
 * (optionally) set the SQL dialect
 * @param {string} dialect - the SQL dialect to use [postgres|mysql|sqlite|mssql|oracle]
 * @param {Object=} config
 * @param {bool=} config.questionMarkParameterPlaceholder
 * @param {string=} config.nullOrder [FIRST|LAST]
 * @param {bool=} config.dateTimeMillis
 *
 * @returns {Sql}
 */
Sql.prototype.setDialect = function(dialect, config) {
  this.dialect     = getDialect(dialect);
  this.dialectName = dialect;
  this.config      = config;

  return this;
};

/**
 * back compat shim for the Sql class constructor
 * @param {string} [dialect=postgres] - the SQL dialect to use [postgres|mysql|sqlite|mssql|oracle]
 * @param {Object=} config
 * @returns {Sql}
 */
var create = function(dialect, config) {
  return new Sql(dialect, {});
};

module.exports = new Sql(DEFAULT_DIALECT, {});
module.exports.create = create;
module.exports.Sql = Sql;
module.exports.Table = Table;
