'use strict';

var util = require('util');

var Sqlite = function() {
  this.output = [];
  this.params = [];
};

util.inherits(Sqlite, require(__dirname + '/mysql'));

Sqlite.prototype._quoteCharacter = '"';

Sqlite.prototype.visitRenameColumn = function(renameColumn) {
  throw new Error(' (CHANGE COLUMN statements require a dataType)');
};


module.exports = Sqlite;
