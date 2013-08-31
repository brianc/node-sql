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
    case 'sqlserver':
      return require('./sqlserver');
    default:
      throw new Error(dialect + ' is unsupported');
  }
};

module.exports = getDialect;
