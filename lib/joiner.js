var getPrimaryKeyColumn = function(table) {
  for(var i = 0; i < table.columns.length; i++) {
    var col = table.columns[i];
    if(col.primaryKey) {
      return col;
    }
  }
};

var findReference = function(left, right) {
  // find reference
  for(var i = 0; i < right.columns.length; i++) {
    var col = right.columns[i];
    if(col.references) {
      var leftName = left.getName();
      if(col.references == leftName || col.references.table == leftName) {
        var leftCol = left[col.references.column] || getPrimaryKeyColumn(left);
        return {
          left: leftCol,
          right: col
        };
      }
    }
  }
};

var Joiner = function() {
  this._tables = [];
  this.$joinNode = null;
};

var findRef = function(left, right) {
  return findReference(left, right) || findReference(right, left) || false;
}

//auto-join two tables based on column properties
//requires one column to have { references: {table: 'foreignTableName', column: 'foreignColumnName'}}
//or to have { references: 'foreignTableName'} -- in which case the foreign table's primary key is assumed
Joiner.prototype.leftJoin = function(left, right) {
  this._tables.push(left);
  this._tables.push(right);
  var ref = findRef(left, right);
  this.$joinNode = left.join(right).on(ref.left.equals(ref.right));
  return this;
};

Joiner.prototype.joinTo = function(right) {
  var ref;
  for(var i = this._tables.length-1; i >= 0; i--) {
    ref = findRef(this._tables[i], right);
    if(ref) break;
  }
  this._tables.push(right);
  this.$joinNode = this.$joinNode.join(right).on(ref.left.equals(ref.right));
  return this;
};

Joiner.prototype.type = 'JOINER';

module.exports = Joiner;
