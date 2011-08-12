var Postgres = function() {
  this.output = [];
  this.params = [];
}

Postgres.prototype.getQuery = function(node) {
  this.visit(node);
  return { text: this.output.join(' '), params: this.params };
}

Postgres.prototype.visit = function(node) {
  switch(node.type) {
    case 'QUERY': return this.visitQuery(node);
    case 'SELECT': return this.visitSelect(node);
    case 'FROM': return this.visitFrom(node);
    case 'WHERE': return this.visitWhere(node);
    case 'BINARY': return this.visitBinary(node);
    case 'TABLE': return this.visitTable(node);
    case 'COLUMN': return this.visitColumn(node);
    case 'JOIN': return this.visitJoin(node);
    case 'TEXT': return node.text;
    case 'UNARY': return this.visitUnary(node);
    case 'PARAMETER': return this.visitParameter(node);
    default: throw new Error("Unrecognized node type " + node.type);
  }
}

Postgres.prototype.push = function(string) {
  this.output.push.apply(this.output, arguments);
  return this;
}

Postgres.prototype.quote = function(word) {
  return '"' + word + '"';
}

Postgres.prototype.visitSelect = function(select) {
    return this.push('SELECT', select.nodes.map(this.visit.bind(this)).join(', '));
}

Postgres.prototype.visitFrom = function(from) {
  this.push('FROM');
  for(var i = 0; i < from.nodes.length; i++) {
    this.push(this.visit(from.nodes[i]));
  }
}

Postgres.prototype.visitWhere = function(where) {
  return this.push('WHERE', where.nodes.map(this.visit.bind(this)).join(', '));
}

Postgres.prototype.visitBinary = function(binary) {
  return '(' + this.visit(binary.left) + ' ' + binary.operator + ' ' + this.visit(binary.right) + ')';
}

Postgres.prototype.visitUnary = function(unary) {
  return '(' + this.visit(unary.left) + ' ' + unary.operator + ')';
}

Postgres.prototype.visitQuery = function(queryNode) {
  return queryNode.nodes.forEach(this.visit.bind(this));
}

Postgres.prototype.visitTable = function(tableNode) {
  var table = tableNode.table;
  var txt = table.getName();
  if(table.quote) {
    txt = '"' + txt + '"';
  }
  if(table.alias) {
    txt += ' AS ' + table.alias;
  }
  return txt;
}

Postgres.prototype.visitColumn = function(columnNode) {
  var table = columnNode.table;
  var txt = "";
  if(table.alias) {
    txt = table.alias;
  } else if(table.quote) {
    txt = '"' + table.getName() + '"';
  } else {
    txt = table.getName();
  }
  return txt + '."' + columnNode.name + '"';
}

Postgres.prototype.visitParameter = function(parameter) {
  this.params.push(parameter.value());
  return "$"+this.params.length;
}

Postgres.prototype.visitJoin = function(join) {
  this.push(this.visit(join.from));
  this.push(join.subType + ' JOIN');
  this.push(this.visit(join.to));
  this.push('ON');
  return this.visit(join.on);
}

module.exports = Postgres;
