'use strict';
var _ = require('lodash');
var FunctionCall = require(__dirname + '/node/functionCall');

// aggregate functions available to all databases
var aggregateFunctions = [
  'AVG',
  'COUNT',
  'MAX',
  'MIN',
  'SUM'
];

// common scalar functions available to most databases
var scalarFunctions = [
  'ABS',
  'COALESC',
  'LENGTH',
  'LOWER',
  'LTRIM',
  'RANDOM',
  'ROUND',
  'RTRIM',
  'SUBSTR',
  'TRIM',
  'UPPER'
];

var functionNames = aggregateFunctions.concat(scalarFunctions);

// create a function that creates a function call of the specific name, using the specified sql instance
var createFunctionCall = function(name, sql) {
  return function() {
    // turn array-like arguments object into a true array
    var args = Array.prototype.slice.call(arguments, 0);
    var functionCall = new FunctionCall(name, args);
    functionCall.sql = sql;
    return functionCall;
  };
};

// creates a hash of the standard functions for a sql instance
var getFunctions = function(sql) {
  var functions = _.reduce(functionNames, function(reducer, name) {
    reducer[name] = createFunctionCall(name, sql);
    return reducer;
  }, {});
  return functions;
};

module.exports.getFunctions = getFunctions;
