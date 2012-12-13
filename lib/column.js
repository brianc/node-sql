var ColumnNode = require(__dirname + '/node/column');
var ParameterNode = require(__dirname + '/node/parameter');
var BinaryNode = require(__dirname + '/node/binary');
var UnaryNode = require(__dirname + '/node/unary');
var TextNode = require(__dirname + '/node/text');
var Column = function(config) {
  this.table = config.table;
  this.name = config.name;
  this.asc = this.ascending = this;
  this.alias = null;
  this.desc = this.descending = new BinaryNode({
    left: this.toNode(),
    right: new TextNode('DESC'),
    operator: ''
  });
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

Column.prototype.value = function(value) {
  this._value = value;
  return this;
}

Column.prototype.getValue = function() {
  return this._value;
}

Column.prototype.toNode = function() {
  //creates a query node from this column
  return new ColumnNode(this);
}

Column.prototype.as = function(alias) {
  this.alias = alias;
  return new ColumnNode(this);
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
