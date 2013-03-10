'use strict';

var util = require('util');

var Sqlite = function() {
  this.output = [];
  this.params = [];
};

util.inherits(Sqlite, require(__dirname + '/postgres'));

Sqlite.prototype._arrayAggFunctionName = 'GROUP_CONCAT';

Sqlite.prototype.visitDefault = function(parameter) {
  throw new Error('SQLite requires that all rows of a multi-row insert are for the same columns.');
};

Sqlite.prototype.visitOrderByColumn = function(column) {
  if(column.direction) {
    return this.visit(column.column) + ' ' + this.visit(column.direction);
  } else {
    return this.visit(column.column);
  }
};

Sqlite.prototype.visitDropColumn = function(dropColumn) {
  throw new Error('SQLite does not allow dropping columns.');
};

Sqlite.prototype.visitRenameColumn = function(renameColumn) {
  throw new Error('SQLite does not allow renaming columns.');
};

Sqlite.prototype.visitIfExists = function() {
  throw new Error('SQLite does not support IF EXISTS.');
};

Sqlite.prototype.visitIfNotExists = function() {
  throw new Error('SQLite does not support IF NOT EXISTS.');
};

module.exports = Sqlite;
