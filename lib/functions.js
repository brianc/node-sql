'use strict';
var _ = require('lodash');
var sliced = require('sliced');
var FunctionCall = require(__dirname + '/node/functionCall');

// create a function that creates a function call of the specific name, using the specified sql instance
var getFunctionCallCreator = function(name, sql) {
  return function() {
    // turn array-like arguments object into a true array
    var functionCall = new FunctionCall(name, sliced(arguments));
    functionCall.sql = sql;
    return functionCall;
  };
};

// creates a hash of functions for a sql instance
var getFunctions = function(functionNames, sql) {
  var functions = _.reduce(functionNames, function(reducer, name) {
    reducer[name] = getFunctionCallCreator(name, sql);
    return reducer;
  }, {});
  return functions;
};

// aggregate functions available to all databases
var aggregateFunctions = [
  'AVG',
  'COUNT',
  'DISTINCT',
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

// hstore function available to Postgres
var hstoreFunction = 'HSTORE';

var standardFunctionNames = aggregateFunctions.concat(scalarFunctions).concat(hstoreFunction);

// creates a hash of standard functions for a sql instance
var getStandardFunctions = function(sql) {
  return getFunctions(standardFunctionNames, sql);
};

module.exports.getStandardFunctions = getStandardFunctions;
