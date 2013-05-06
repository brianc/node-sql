'use strict';

var ColumnNode = require(__dirname + '/node/column');
var ParameterNode = require(__dirname + '/node/parameter');
var BinaryNode = require(__dirname + '/node/binary');
var OrderByColumnNode = require(__dirname + '/node/orderByColumn');
var UnaryNode = require(__dirname + '/node/unary');
var TextNode = require(__dirname + '/node/text');

var Column = function(config) {
  this.table = config.table;
  for(var name in config) {
    this[name] = config[name];
  }
  this.asc = this.ascending = this;
  this.alias = null;
  this.desc = this.descending = new OrderByColumnNode({
    column: this.toNode(),
    direction: new TextNode('DESC')
  });
  this.dataType = config.dataType;
};

var binaryMethod = function(name, operator) {
  Column.prototype[name] = function(val) {
    var node = new BinaryNode({
      left: this.toNode(),
      operator: operator
    });
    if (Array.isArray(val)) {
      node.right = val.map(function (v) {
        return v.toNode ? v.toNode() : new ParameterNode(v);
      });
    }
    else {
      node.right = val.toNode ? val.toNode() : new ParameterNode(val);
    }
    return node;
  };
};

var unaryMethod = function(name, operator) {
  /*jshint unused: false */
  Column.prototype[name] = function(val) {
    return new UnaryNode({
      left: this.toNode(),
      operator: operator
    });
  };
};

var contextify = function(base) {
  var context = Object.create(Column.prototype);
  Object.keys(base).forEach(function (key) {
    context[key] = base[key];
  });
  return context;
};

Column.prototype.value = function(value) {
  this._value = value;
  return this;
};

Column.prototype.getValue = function() {
  return this._value;
};

Column.prototype.toNode = function() {
  //creates a query node from this column
  return new ColumnNode(contextify(this));
};

Column.prototype.as = function(alias) {
  var context = contextify(this);
  context.alias = alias;
  return new ColumnNode(context);
};

Column.prototype.arrayAgg = function(alias) {
  var context = contextify(this);
  context.asArray = true;
  context.alias = alias || context.name + 's';
  return new ColumnNode(context);
};

Column.prototype.count = function(alias) {
  var context = contextify(this);
  context.aggCount = true;
  context.alias = alias || context.name + '_count';
  return new ColumnNode(context);
};

Column.prototype.distinct = function() {
  var context = contextify(this);
  context.distinct = true;
  return new ColumnNode(context);
};

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
binaryMethod('in', 'IN');
binaryMethod('notIn', 'NOT IN');

module.exports = Column;
