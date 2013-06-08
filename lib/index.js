'use strict';

var Table = require(__dirname + '/table');

function create(dialect) {
  var sql = {
    Table: Table,
    define: function(def) { 
        if (!def.sql) def.sql = this;
        return Table.define(def, this); 
    },
    select: function() {
      var Query = require(__dirname + '/node/query');
      var query = new Query({sql: this});
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
  if (dialect) sql.setDialect(dialect);
  return sql;
}


module.exports = create('postgres');
module.exports.create = create;
