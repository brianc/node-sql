'use strict';

// given a dialect name, return the class
var getDialect = function(dialect) {
  switch (dialect.toLowerCase()) {
    case 'postgres':
      return require('./postgres');
    case 'mysql':
      return require('./mysql');
    case 'sqlite':
      return require('./sqlite');
    case 'mssql':
      return require('./mssql');
    case 'oracle':
      return require('./oracle');
    default:
      throw new Error(dialect + ' is unsupported');
  }
};

module.exports = getDialect;
