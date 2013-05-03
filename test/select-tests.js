'use strict';

var assert = require('assert');
var Select = require(__dirname + '/../lib/node/select');

var select = new Select();
assert.equal(select.type, 'SELECT');

assert.equal(select.toQuery().text, 'SELECT ');
