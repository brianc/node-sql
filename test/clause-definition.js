var test = require('tap').test;
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

test('clause definition', function(t) {
  var select = new Bang();
  t.equal(select.type, 'SELECT');
  t.equal(select.nodes.length, 0);

  var q = new Boom('hai');
  t.equal(q.nodes.length, 0);
  var q2 = new Boom('bai');
  q.nodes.push(1);
  t.equal(q.nodes.length, 1);
  t.equal(q.name, 'hai');
  t.equal(q2.nodes.length, 0);
  t.equal(q2.name, 'bai');
  t.end();
})
