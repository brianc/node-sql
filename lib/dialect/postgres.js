'use strict';

var util = require('util');
var assert = require('assert');
var From = require(__dirname + '/../node/from');
var Parameter = require(__dirname + '/../node/parameter');
var Postgres = function() {
  this.output = [];
  this.params = [];
};

Postgres.prototype._arrayAggFunctionName = 'array_agg';

Postgres.prototype.getQuery = function(queryNode) {
  this.visitQuery(queryNode);
  return { text: this.output.join(' '), values: this.params };
};


Postgres.prototype.visit = function(node) {
  switch(node.type) {
    case 'QUERY': return this.visitQuery(node);
    case 'SUBQUERY': return this.visitSubquery(node);
    case 'SELECT': return this.visitSelect(node);
    case 'INSERT': return this.visitInsert(node);
    case 'UPDATE': return this.visitUpdate(node);
    case 'DELETE': return this.visitDelete();
    case 'CREATE': return this.visitCreate(node);
    case 'DROP': return this.visitDrop(node);
    case 'ALTER': return this.visitAlter(node);
    case 'FROM': return this.visitFrom(node);
    case 'WHERE': return this.visitWhere(node);
    case 'ORDER BY': return this.visitOrderBy(node);
    case 'ORDER BY COLUMN': return this.visitOrderByColumn(node);
    case 'GROUP BY': return this.visitGroupBy(node);
    case 'RETURNING': return this.visitReturning(node);
    case 'BINARY': return this.visitBinary(node);
    case 'TABLE': return this.visitTable(node);
    case 'COLUMN': return this.visitColumn(node);
    case 'JOIN': return this.visitJoin(node);
    case 'TEXT': return node.text;
    case 'UNARY': return this.visitUnary(node);
    case 'PARAMETER': return this.visitParameter(node);
    case 'DEFAULT': return this.visitDefault(node);
    case 'IF EXISTS': return this.visitIfExists();
    case 'IF NOT EXISTS': return this.visitIfNotExists();
    case 'ADD COLUMN': return this.visitAddColumn(node);
    case 'DROP COLUMN': return this.visitDropColumn(node);
    case 'RENAME COLUMN': return this.visitRenameColumn(node);
    case 'LIMIT':
    case 'OFFSET':
      return this.visitModifier(node);
    default: throw new Error("Unrecognized node type " + node.type);
  }
};

Postgres.prototype._quoteCharacter = '"';
Postgres.prototype.quote = function(word) {
  var q = this._quoteCharacter;
  return q + word.replace(new RegExp(q,'g'),q+q) + q;
};

Postgres.prototype.visitSelect = function(select) {
  var result = ['SELECT', select.nodes.map(this.visit.bind(this)).join(', ')];
  this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitInsert = function(insert) {
  var self = this;
  this._visitedFrom = true;
  //don't use table.column for inserts
  this._visitedInsert = true;

  var paramNodes = insert.getParameters()
    .map(function (paramSet) {
      return paramSet.map(function (param) {
        return self.visit(param);
      }).join(', ');
    }).map(function (param) {
      return '('+param+')';
    }).join(', ');

  var result = [
    'INSERT INTO',
    this.visit(this._queryNode.table.toNode()),
    '(' + insert.columns.map(this.visit.bind(this)).join(', ') + ')',
    'VALUES', paramNodes
  ];
  return result;
};

Postgres.prototype.visitUpdate = function(update) {
  //don't auto-generate from clause
  this._visitedFrom = true;
  var params = [];
  /*jshint boss: true */
  for(var i = 0, node; node = update.nodes[i]; i++) {
    this._visitingUpdateTargetColumn = true;
    var target_col = this.visit(node);
    this._visitingUpdateTargetColumn = false;
    params = params.concat(target_col + ' = ' + this.visit(node.value));
  }
  var result = [
    'UPDATE',
    this.visit(this._queryNode.table.toNode()),
    'SET',
    params.join(', ')
  ];
  return result;
};

Postgres.prototype.visitDelete = function() {
  this._selectOrDeleteEndIndex = 1;
  return ['DELETE'];
};

Postgres.prototype.visitCreate = function(create) {
  this._visitingCreate = true;
  //don't auto-generate from clause
  this._visitedFrom = true;
  var table = this._queryNode.table;
  var col_nodes = table.columns.map(function(col) { return col.toNode(); });

  var result = ['CREATE TABLE'];
  result = result.concat(create.nodes.map(this.visit.bind(this)));
  result.push(this.visit(table.toNode()));
  result.push('(' + col_nodes.map(this.visit.bind(this)).join(', ') + ')');
  this._visitingCreate = false;
  return result;
};

Postgres.prototype.visitDrop = function(drop) {
  //don't auto-generate from clause
  this._visitedFrom = true;
  var result = ['DROP TABLE'];
  result = result.concat(drop.nodes.map(this.visit.bind(this)));
  result.push(this.visit(this._queryNode.table.toNode()));
  return result;
};

Postgres.prototype.visitAlter = function(alter) {
  this._visitingAlter = true;
  //don't auto-generate from clause
  this._visitedFrom = true;
  var table = this._queryNode.table;
  var col_nodes = table.columns.map(function(col) { return col.toNode(); });
  var result = [
    'ALTER TABLE',
    this.visit(table.toNode()),
    alter.nodes.map(this.visit.bind(this)).join(', ')
  ];
  this._visitingAlter = false;
  return result;
};

Postgres.prototype.visitFrom = function(from) {
  this._visitedFrom = true;
  var result = [];
  result.push('FROM');
  for(var i = 0; i < from.nodes.length; i++) {
    result = result.concat(this.visit(from.nodes[i]));
  }
  return result;
};

Postgres.prototype.visitWhere = function(where) {
  var result = ['WHERE', where.nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitOrderBy = function(orderBy) {
  var result = ['ORDER BY', orderBy.nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitOrderByColumn = function(column) {
  if(column.direction) {
    return this.visit(column.column) + ' ' + this.visit(column.direction);
  } else {
    return this.visit(column.column);
  }
};

Postgres.prototype.visitGroupBy = function(groupBy) {
  var result = ['GROUP BY', groupBy.nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitBinary = function(binary) {
  var self = this;
  var result = '(' + this.visit(binary.left) + ' ' + binary.operator + ' ';
  if (Array.isArray(binary.right)) {
    result += '(' + binary.right.map(function (node) {
      return self.visit(node);
    }).join(', ') + ')';
  }
  else {
    result += this.visit(binary.right);
  }
  result += ')';
  return result;
};

Postgres.prototype.visitUnary = function(unary) {
  return '(' + this.visit(unary.left) + ' ' + unary.operator + ')';
};

Postgres.prototype.visitQuery = function(queryNode) {
  this._queryNode = queryNode;
  for(var i = 0; i < queryNode.nodes.length; i ++) {
    var res = this.visit(queryNode.nodes[i]);
    this.output = this.output.concat(res);
  }
  //implicit 'from'
  if(!this._visitedFrom) {
    var select = this.output.slice(0, this._selectOrDeleteEndIndex);
    var from = this.visitFrom(new From().add(queryNode.table.toNode()));
    var rest = this.output.slice(this._selectOrDeleteEndIndex);
    this.output = select.concat(from).concat(rest);
  }
  return this;
};

Postgres.prototype.visitSubquery = function(queryNode) {
  var result = [];
  for(var i = 0; i < queryNode.nodes.length; i ++) {
    var res = this.visit(queryNode.nodes[i]);
    result = result.concat(res);
  }
  //implicit 'from'
  if(!this._visitedFrom) {
    var select = result.slice(0, this._selectOrDeleteEndIndex);
    var from = this.visitFrom(new From().add(queryNode.table.toNode()));
    var rest = result.slice(this._selectOrDeleteEndIndex);
    result = select.concat(from).concat(rest);
  }
  result[0] = '('+result[0];
  result[result.length-1] = result[result.length-1] + ') ' + queryNode.alias;
  return result;
};

Postgres.prototype.visitTable = function(tableNode) {
  var table = tableNode.table;
  var txt="";
  if(table.getSchema()) {
    txt = this.quote(table.getSchema());
    txt += '.';
  }
  txt += this.quote(table.getName());
  if(table.alias) {
    txt += ' AS ' + this.quote(table.alias);
  }
  return txt;
};

Postgres.prototype.visitColumn = function(columnNode) {
  var table = columnNode.table;
  var inSelectClause = !this._selectOrDeleteEndIndex;
  var txt = "";
  if(inSelectClause) {
    if (columnNode.asArray) {
      txt += this._arrayAggFunctionName+'(';
    } else if (columnNode.aggCount) {
      txt += 'COUNT(';
    }
  }
  if(!this._visitedInsert && !this._visitingUpdateTargetColumn && !this._visitingCreate && !this._visitingAlter) {
    if(table.alias) {
      txt = this.quote(table.alias);
    } else {
      if(table.getSchema()) {
        txt = this.quote(table.getSchema());
        txt += '.';
      }
      txt += this.quote(table.getName());
    }
    txt += '.';
  }
  if (columnNode.star) {
    txt += '*';
  } else {
    txt += this.quote(columnNode.name);
  }
  if(inSelectClause && (columnNode.asArray || columnNode.aggCount)) {
    txt += ')';
  }
  if(inSelectClause && columnNode.alias) {
    txt += ' AS ' + this.quote(columnNode.alias);
  }
  if(this._visitingCreate || this._visitingAddColumn) {
    assert(columnNode.dataType, 'dataType missing for column ' + columnNode.name +
      ' (CREATE TABLE and ADD COLUMN statements require a dataType)');
    txt += ' ' + columnNode.dataType;
  }
  return txt;
};

Postgres.prototype.visitParameter = function(parameter) {
  this.params.push(parameter.value());
  return "$"+this.params.length;
};

Postgres.prototype.visitDefault = function(parameter) {
  var params = this.params;
  this.params.push('DEFAULT');
  return "$"+params.length;
};

Postgres.prototype.visitAddColumn = function(addColumn) {
  this._visitingAddColumn = true;
  var result = ['ADD COLUMN ' + this.visit(addColumn.nodes[0])];
  this._visitingAddColumn = false;
  return result;
};

Postgres.prototype.visitDropColumn = function(dropColumn) {
  return ['DROP COLUMN ' + this.visit(dropColumn.nodes[0])];
};

Postgres.prototype.visitRenameColumn = function(renameColumn) {
  return ['RENAME COLUMN ' + this.visit(renameColumn.nodes[0]) + ' TO ' + this.visit(renameColumn.nodes[1])];
};

Postgres.prototype.visitIfExists = function() {
  return ['IF EXISTS'];
};

Postgres.prototype.visitIfNotExists = function() {
  return ['IF NOT EXISTS'];
};

Postgres.prototype.visitJoin = function(join) {
  var result = [];
  result = result.concat(this.visit(join.from));
  result = result.concat(join.subType + ' JOIN');
  result = result.concat(this.visit(join.to));
  result = result.concat('ON');
  result = result.concat(this.visit(join.on));
  return result;
};

Postgres.prototype.visitReturning = function(returning) {
  return ['RETURNING', returning.nodes.map(this.visit.bind(this)).join(', ')];
};

Postgres.prototype.visitModifier = function(node) {
  return [node.type, node.count];
};

module.exports = Postgres;
