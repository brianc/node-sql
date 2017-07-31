'use strict';

var DefaultNode   = require('./default');
var Node          = require('./');
var ParameterNode = require('./parameter');

var Replace = Node.define({
  type: 'REPLACE',
  constructor: function () {
    Node.call(this);
    this.names = [];
    this.columns = [];
    this.valueSets = [];
  }
});

module.exports = Replace;

Replace.prototype.add = function (nodes) {
  var hasColumns = false;
  var hasValues = false;
  var self = this;
  var values = {};
  nodes.forEach(function (node) {
    var column = node.toNode();
    var name = column.name;
    var idx = self.names.indexOf(name);
    if (idx < 0) {
      self.names.push(name);
      self.columns.push(column);
    }
    hasColumns = true;
    hasValues = hasValues || column.value !== undefined;
    values[name] = column;
  });

  // When none of the columns have a value, it's ambiguous whether the user
  // intends to replace a row of default values or append a SELECT statement
  // later.  Resolve the ambiguity by assuming that if no columns are specified
  // it is a row of default values, otherwise a SELECT will be added.
  if (hasValues || !hasColumns) {
    this.valueSets.push(values);
  }

  return self;
};

/*
 * Get parameters for all values to be replaced. This function
 * handles handles bulk replaces, where keys may be present
 * in some objects and not others. When keys are not present,
 * the replace should refer to the column value as DEFAULT.
 */
Replace.prototype.getParameters = function () {
  var self = this;
  return this.valueSets
    .map(function (nodeDict) {
      var set = [];
      self.names.forEach(function (name) {
        var node = nodeDict[name];
        if (node) {
          set.push(ParameterNode.getNodeOrParameterNode(node.value));
        }
        else {
          set.push(new DefaultNode());
        }
      });
      return set;
    });
};
