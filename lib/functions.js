'use strict';
var sliced = require('sliced');
var FunctionCall = require(__dirname + '/node/functionCall');

var standardFunctionNames = [
  // aggregate functions available to all databases
  'AVG',
  'COUNT',
  'DISTINCT',
  'MAX',
  'MIN',
  'SUM',

  // common scalar functions available to most databases
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
  'UPPER',

  // hstore function available to Postgres
  'HSTORE',

  // text search functions available to Postgres
  'TS_RANK',
  'TS_RANK_CD',
  'PLAINTO_TSQUERY',
  'TO_TSQUERY',
  'TO_TSVECTOR',
  'SETWEIGHT'
];

// creates a hash of standard functions for a sql instance
module.exports.getStandardFunctions = function () {
  return standardFunctionNames.reduce(function (functions, name) {
    functions[name] = function () {
      return new FunctionCall(name, sliced(arguments));
    };
    return functions;
  }, {});
};
