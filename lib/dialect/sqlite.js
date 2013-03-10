'use strict';

var util = require('util');

var Sqlite = function() {
  this.output = [];
  this.params = [];
};

util.inherits(Sqlite, require(__dirname + '/mysql'));

Sqlite.prototype._quoteCharacter = '"';

Sqlite.prototype.visitRenameColumn = function(renameColumn) {
  throw new Error('SQLite does not allow renaming columns');
};


module.exports = Sqlite;
