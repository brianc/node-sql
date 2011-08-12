var assert = require('assert');
var Node = require(__dirname + '/../lib/node/');

console.log('node definition');
var Bang = Node.define({
  type: 'SELECT'
})

var Boom = Node.define({
  constructor: function(n) {
    this.name = n;
  }
});

var select = new Bang();
assert.equal(select.type, 'SELECT');
assert.equal(select.nodes.length, 0);

var q = new Boom('hai');
assert.equal(q.nodes.length, 0);
var q2 = new Boom('bai');
q.nodes.push(1);
assert.equal(q.nodes.length, 1);
assert.equal(q.name, 'hai');
assert.equal(q2.nodes.length, 0);
assert.equal(q2.name, 'bai');
