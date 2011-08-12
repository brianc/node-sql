var ColumnNode = require(__dirname + '/node/column');
var ParameterNode = require(__dirname + '/node/parameter');
var BinaryNode = require(__dirname + '/node/binary');
var UnaryNode = require(__dirname + '/node/unary');
var Column = function(config) {
  this.table = config.table;
  this.name = config.name;
}

var binaryMethod = function(name, operator) {
  Column.prototype[name] = function(val) {
    return new BinaryNode({
      left: this.toNode(),
      operator: operator,
      right: val.toNode ? val.toNode() : new ParameterNode(val)
    })
  }
}

var unaryMethod = function(name, operator) {
  Column.prototype[name] = function(val) {
    return new UnaryNode({
      left: this.toNode(),
      operator: operator
    });
  }
}

Column.prototype.toNode = function() {
  //creates a query node from this column
  return new ColumnNode({
    name: this.name,
    table: this.table
  });
}

binaryMethod('equals', '=');
binaryMethod('equal', '=');
binaryMethod('notEqual', '<>');
binaryMethod('notEquals', '<>');
unaryMethod('isNull', 'IS NULL');
unaryMethod('isNotNull', 'IS NOT NULL');
binaryMethod('gt', '>');
binaryMethod('gte', '>=');
binaryMethod('lt', '<');
binaryMethod('lte', '<=');
binaryMethod('like', 'LIKE');

module.exports = Column;
