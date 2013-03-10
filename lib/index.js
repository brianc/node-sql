'use strict';

var Table = require(__dirname + '/table');

var sql = {
  Table: Table,
  define: Table.define,
  select: function() {
    var Query = require(__dirname + '/node/query');
    var query = new Query();
    query.select.apply(query, arguments);
    return query;
  },
  setDialect: function(dialect) {
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
  }
};

module.exports = sql.setDialect('postgres');
