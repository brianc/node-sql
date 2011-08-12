var Node = function(type) {
  this.nodes = [];
}

Node.prototype.toNode = function() {
  return this;
}

Node.prototype.add = function(node) {
  this.nodes.push(node);
  return this;
}

Node.define = function(def) {
  var c = function() {
    Node.apply(this, arguments)
    if(def.constructor) {
      def.constructor.apply(this, arguments)
    }
  }
  for(var key in Node.prototype) {
    c.prototype[key] = Node.prototype[key];
  }
  for(var key in def) {
    c.prototype[key] = def[key];
  }
  return c;
}

module.exports = Node;
