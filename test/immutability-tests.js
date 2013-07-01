/* global describe, it */
'use strict';
var assert = require('assert');

var ColumnNode = require('../lib/node/column');
var CreateIndexNode = require('../lib/node/createIndex');

describe('ColumnNode', function() {
  var original = new ColumnNode({});
  var originalJSON = JSON.stringify(original);
  var checkUnchanged = function() {
    assert.equal(JSON.stringify(original), originalJSON);
  };

  it('#as immutable', function() {
    assert.notEqual(original, original.as(''));
    checkUnchanged();
  });
});

describe('CreateIndexNode', function() {
  var original = new CreateIndexNode('table', 'name');
  var originalJSON = JSON.stringify(original);
  var checkUnchanged = function() {
    assert.equal(JSON.stringify(original), originalJSON);
  };

  it('#unique immutable', function() {
    assert.notEqual(original, original.unique());
    checkUnchanged();
  });

  it('#spatial immutable', function() {
    assert.notEqual(original, original.spatial());
    checkUnchanged();
  });

  it('#fulltext immutable', function() {
    assert.notEqual(original, original.fulltext());
    checkUnchanged();
  });

  it('#using immutable', function() {
    assert.notEqual(original, original.using(''));
    checkUnchanged();
  });

  it('#on immutable', function() {
    assert.notEqual(original, original.on(''));
    checkUnchanged();
  });

  it('#withParser immutable', function() {
    assert.notEqual(original, original.withParser(''));
    checkUnchanged();
  });
});
