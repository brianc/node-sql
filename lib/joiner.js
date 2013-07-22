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

module.exports = {
  // auto-join two tables based on column properties
  // requires one column to have { references: {table: 'foreignTableName', column: 'foreignColumnName'}}
  // or to have { references: 'foreignTableName'} -- in which case the foreign table's primary key is assumed
  leftJoin: function(left, right) {
    var leftCol, rightCol;
    var ref = findReference(left, right);
    if(!ref) {
      ref = findReference(right, left);
    }
    return left.join(right).on(ref.left.equals(ref.right));
  }
};
