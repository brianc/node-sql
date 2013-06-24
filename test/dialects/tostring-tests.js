'use strict';

var assert        = require('assert');
var Harness       = require('./support');
var ParameterNode = require('../../lib/node/parameter');
var post          = Harness.definePostTable();

// Null
Harness.test({
  query: post.content.equals(null),
  pg: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = NULL)'
  },
  sqlite: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = NULL)'
  },
  mysql: {
    text  : '(`post`.`content` = ?)',
    string: '(`post`.`content` = NULL)'
  },
  params: [null]
});

// Number
Harness.test({
  query: post.content.equals(3.14),
  pg: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = 3.14)'
  },
  sqlite: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = 3.14)'
  },
  mysql: {
    text  : '(`post`.`content` = ?)',
    string: '(`post`.`content` = 3.14)'
  },
  params: [3.14]
});

// String
Harness.test({
  query: post.content.equals('hello\''),
  pg: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'hello\'\'\')'
  },
  sqlite: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'hello\'\'\')'
  },
  mysql: {
    text  : '(`post`.`content` = ?)',
    string: '(`post`.`content` = \'hello\'\'\')'
  },
  params: ['hello\'']
});

// Array
Harness.test({
  query: post.content.equals([1, '2', null]),
  pg: {
    text  : '("post"."content" = ($1, $2, $3))',
    string: '("post"."content" = (1, \'2\', NULL))'
  },
  sqlite: {
    text  : '("post"."content" = ($1, $2, $3))',
    string: '("post"."content" = (1, \'2\', NULL))'
  },
  mysql: {
    text  : '(`post`.`content` = (?, ?, ?))',
    string: '(`post`.`content` = (1, \'2\', NULL))'
  },
  params: [1, '2', null]
});

// Date
Harness.test({
  query: post.content.equals(new Date('Sat, 01 Jan 2000 00:00:00 GMT')),
  pg: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'2000-01-01T00:00:00.000Z\')'
  },
  sqlite: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'2000-01-01T00:00:00.000Z\')'
  },
  mysql: {
    text  : '(`post`.`content` = ?)',
    string: '(`post`.`content` = \'2000-01-01T00:00:00.000Z\')'
  },
  params: [new Date('Sat, 01 Jan 2000 00:00:00 GMT')]
});

// Object
var customObject = {
  toString: function() {
    return 'secretMessage';
  }
};

Harness.test({
  query: post.content.equals(customObject),
  pg: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'secretMessage\')'
  },
  sqlite: {
    text  : '("post"."content" = $1)',
    string: '("post"."content" = \'secretMessage\')'
  },
  mysql: {
    text  : '(`post`.`content` = ?)',
    string: '(`post`.`content` = \'secretMessage\')'
  },
  params: [customObject]
});


// Undefined
assert.throws(function() {
  post.content.equals(undefined).toString();
});
