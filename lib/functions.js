'use strict';
var _ = require('lodash');
var sliced = require('sliced');
var FunctionCall = require('./node/functionCall');

// create a function that creates a function call of the specific name, using the specified sql instance
var getFunctionCallCreator = function(name) {
  return function() {
    // turn array-like arguments object into a true array
    return new FunctionCall(name, sliced(arguments));
  };
};

// creates a hash of functions for a sql instance
var getFunctions = function(functionNames) {
  if (typeof functionNames === 'string')
    return getFunctionCallCreator(functionNames);

  var functions = _.reduce(functionNames, function(reducer, name) {
    reducer[name] = getFunctionCallCreator(name);
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
  'COALESCE',
  'LEFT',
  'LENGTH',
  'LOWER',
  'LTRIM',
  'RANDOM',
  'RIGHT',
  'ROUND',
  'RTRIM',
  'SUBSTR',
  'TRIM',
  'UPPER'
];

var dateFunctions = [
  'YEAR',
  'MONTH',
  'DAY',
  'HOUR',
  'CURRENT_TIMESTAMP'
];

// hstore function available to Postgres
var hstoreFunction = 'HSTORE';

//text search functions available to Postgres
var textsearchFunctions = ['TS_RANK','TS_RANK_CD', 'PLAINTO_TSQUERY', 'TO_TSQUERY', 'TO_TSVECTOR', 'SETWEIGHT'];

var standardFunctionNames = aggregateFunctions.concat(scalarFunctions).concat(hstoreFunction).concat(textsearchFunctions).concat(dateFunctions);

// creates a hash of standard functions for a sql instance
var getStandardFunctions = function() {
  return getFunctions(standardFunctionNames);
};

module.exports.getFunctions = getFunctions;
module.exports.getStandardFunctions = getStandardFunctions;
