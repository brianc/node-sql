'use strict';

var _      = require('lodash');
var assert = require('assert');
var From   = require('../node/from');
var Select = require('../node/select');
var Table  = require('../table');

var Postgres = function() {
  this.output = [];
  this.params = [];
};

Postgres.prototype._myClass = Postgres;

Postgres.prototype._arrayAggFunctionName = 'array_agg';

Postgres.prototype._getParameterText = function(index, value) {
  if (this._disableParameterPlaceholders) {
    // do not use placeholder
    return this._getParameterValue(value);
  } else {
    // use placeholder
    return this._getParameterPlaceholder(index, value);
  }
};

Postgres.prototype._getParameterValue = function(value) {
  // handle primitives
  if (null === value) {
    value = 'NULL';
  } else if ('boolean' === typeof value) {
    value = value ? 'TRUE' : 'FALSE';
  } else if ('number' === typeof value) {
    // number is just number
    value = value;
  } else if ('string' === typeof value) {
    // string uses single quote
    value = this.quote(value, "'");
  } else if ('object' === typeof value) {
    if (_.isArray(value)) {
      // convert each element of the array
      value = _.map(value, this._getParameterValue, this);
      value = '(' + value.join(', ') + ')';
    } else if (_.isFunction(value.toISOString)) {
      // Date object's default toString format does not get parsed well
      // Handle date like objects using toISOString
      value = this._getParameterValue(value.toISOString());
    } else if (Buffer.isBuffer(value)) {
      value = this._getParameterValue('\\x' + value.toString('hex'));
    } else {
      // rich object represent with string
      value = this._getParameterValue(value.toString());
    }
  } else {
    throw new Error('Unable to use ' + value + ' in query');
  }

  // value has been converted at this point
  return value;
};

Postgres.prototype._getParameterPlaceholder = function(index, value) {
  /* jshint unused: false */
  return '$' + index;
};

Postgres.prototype.getQuery = function(queryNode) {
  // passed in a table, not a query
  if (queryNode instanceof Table) {
    queryNode = queryNode.select(queryNode.star());
  }
  this.output = this.visit(queryNode);

  // create the query object
  var query = { text: this.output.join(' '), values: this.params };

  // reset the internal state of this builder
  this.output = [];
  this.params = [];

  return query;
};

Postgres.prototype.getString = function(queryNode) {
  // switch off parameter placeholders
  var previousFlagStatus = this._disableParameterPlaceholders;
  this._disableParameterPlaceholders = true;
  var query;
  try {
    // use the same code path for query building
    query = this.getQuery(queryNode);
  } finally {
    // always restore the flag afterwards
    this._disableParameterPlaceholders = previousFlagStatus;
  }
  return query.text;
};

Postgres.prototype.visit = function(node) {
  switch(node.type) {
    case 'QUERY'           : return this.visitQuery(node);
    case 'SUBQUERY'        : return this.visitSubquery(node);
    case 'SELECT'          : return this.visitSelect(node);
    case 'INSERT'          : return this.visitInsert(node);
    case 'UPDATE'          : return this.visitUpdate(node);
    case 'DELETE'          : return this.visitDelete(node);
    case 'CREATE'          : return this.visitCreate(node);
    case 'DROP'            : return this.visitDrop(node);
    case 'ALIAS'           : return this.visitAlias(node);
    case 'ALTER'           : return this.visitAlter(node);
    case 'CAST'            : return this.visitCast(node);
    case 'FROM'            : return this.visitFrom(node);
    case 'WHERE'           : return this.visitWhere(node);
    case 'ORDER BY'        : return this.visitOrderBy(node);
    case 'ORDER BY VALUE'  : return this.visitOrderByValue(node);
    case 'GROUP BY'        : return this.visitGroupBy(node);
    case 'HAVING'          : return this.visitHaving(node);
    case 'RETURNING'       : return this.visitReturning(node);
    case 'FOR UPDATE'      : return this.visitForUpdate();
    case 'FOR SHARE'       : return this.visitForShare();
    case 'TABLE'           : return this.visitTable(node);
    case 'COLUMN'          : return this.visitColumn(node);
    case 'JOIN'            : return this.visitJoin(node);
    case 'LITERAL'         : return this.visitLiteral(node);
    case 'TEXT'            : return node.text;
    case 'PARAMETER'       : return this.visitParameter(node);
    case 'DEFAULT'         : return this.visitDefault(node);
    case 'IF EXISTS'       : return this.visitIfExists();
    case 'IF NOT EXISTS'   : return this.visitIfNotExists();
    case 'CASCADE'         : return this.visitCascade();
    case 'RESTRICT'        : return this.visitRestrict();
    case 'RENAME'          : return this.visitRename(node);
    case 'ADD COLUMN'      : return this.visitAddColumn(node);
    case 'DROP COLUMN'     : return this.visitDropColumn(node);
    case 'RENAME COLUMN'   : return this.visitRenameColumn(node);
    case 'INDEXES'         : return this.visitIndexes(node);
    case 'CREATE INDEX'    : return this.visitCreateIndex(node);
    case 'DROP INDEX'      : return this.visitDropIndex(node);
    case 'FUNCTION CALL'   : return this.visitFunctionCall(node);
    case 'ARRAY CALL'      : return this.visitArrayCall(node);

    case 'POSTFIX UNARY' : return this.visitPostfixUnary(node);
    case 'PREFIX UNARY'  : return this.visitPrefixUnary(node);
    case 'BINARY'        : return this.visitBinary(node);
    case 'TERNARY'       : return this.visitTernary(node);
    case 'IN'            : return this.visitIn(node);
    case 'NOT IN'        : return this.visitNotIn(node);
    case 'CASE'          : return this.visitCase(node);
    case 'AT'            : return this.visitAt(node);
    case 'SLICE'         : return this.visitSlice(node);

    case 'LIMIT' :
    case 'OFFSET':
      return this.visitModifier(node);
    default:
      throw new Error("Unrecognized node type " + node.type);
  }
};

Postgres.prototype._quoteCharacter = '"';
Postgres.prototype.quote = function(word, quoteCharacter) {
  var q;
  if (quoteCharacter) {
    // use the specified quote character if given
    q = quoteCharacter;
  } else {
    q = this._quoteCharacter;
  }

  return q + word.replace(new RegExp(q,'g'),q+q) + q;
};

Postgres.prototype.visitSelect = function(select) {
  var result = ['SELECT', select.nodes.map(this.visit.bind(this)).join(', ')];
  this._selectOrDeleteEndIndex = this.output.length + result.length;
  return result;
};

Postgres.prototype.visitInsert = function(insert) {
  var self = this;
  // don't use table.column for inserts
  this._visitedInsert = true;

  var result = [
    'INSERT INTO',
    this.visit(this._queryNode.table.toNode()),
    '(' + insert.columns.map(this.visit.bind(this)).join(', ') + ')'
  ];

  var paramNodes = insert.getParameters();

  if (paramNodes.length > 0) {
    var paramText = paramNodes.map(function (paramSet) {
        return paramSet.map(function (param) {
          return self.visit(param);
        }).join(', ');
      }).map(function (param) {
        return '('+param+')';
      }).join(', ');

    result.push('VALUES', paramText);

    if (result.slice(2, 5).join(' ') === '() VALUES ()') {
      result.splice(2, 3, 'DEFAULT VALUES');
    }
  }

  return result;
};

Postgres.prototype.visitUpdate = function(update) {
  // don't auto-generate from clause
  var params = [];
  /* jshint boss: true */
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

Postgres.prototype.visitDelete = function (del) {
  var result = ['DELETE'];
  if (del.nodes.length) {
    result.push(del.nodes.map(this.visit.bind(this)).join(', '));
  }
  this._selectOrDeleteEndIndex = result.length;
  return result;
};

Postgres.prototype.visitCreate = function(create) {
  this._visitingCreate = true;
  // don't auto-generate from clause
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
  // don't auto-generate from clause
  var result = ['DROP TABLE'];
  result = result.concat(drop.nodes.map(this.visit.bind(this)));
  return result;
};

Postgres.prototype.visitAlias = function(alias) {
  var result = [this.visit(alias.value) + ' AS ' + this.quote(alias.alias)];
  return result;
};

Postgres.prototype.visitAlter = function(alter) {
  this._visitingAlter = true;
  // don't auto-generate from clause
  var table = this._queryNode.table;
  var result = [
    'ALTER TABLE',
    this.visit(table.toNode()),
    alter.nodes.map(this.visit.bind(this)).join(', ')
  ];
  this._visitingAlter = false;
  return result;
};

Postgres.prototype.visitCast = function(cast) {
  var result = ['CAST(' + this.visit(cast.value) + ' AS ' + cast.dataType + ')'];
  return result;
};

Postgres.prototype.visitFrom = function(from) {
  var result = [];
  if (from.skipFromStatement) {
    result.push(',');
  } else {
    result.push('FROM');
  }
  for(var i = 0; i < from.nodes.length; i++) {
    result = result.concat(this.visit(from.nodes[i]));
  }
  return result;
};

Postgres.prototype.visitWhere = function(where) {
  this._visitingWhere = true;
  var result = ['WHERE', where.nodes.map(this.visit.bind(this)).join(', ')];
  this._visitingWhere = false;
  return result;
};

Postgres.prototype.visitOrderBy = function(orderBy) {
  var result = ['ORDER BY', orderBy.nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitOrderByValue = function(orderByValue) {
  var text = this.visit(orderByValue.value);
  if (orderByValue.direction) {
    text += ' ' + this.visit(orderByValue.direction);
  }
  return [text];
};

Postgres.prototype.visitGroupBy = function(groupBy) {
  var result = ['GROUP BY', groupBy.nodes.map(this.visit.bind(this)).join(', ')];
  return result;
};

Postgres.prototype.visitHaving = function(having) {
  var result = ['HAVING', having.nodes.map(this.visit.bind(this)).join(' AND ')];
  return result;
};

Postgres.prototype.visitPrefixUnary = function(unary) {
  var text = '(' + unary.operator + ' ' + this.visit(unary.left) + ')';
  return [text];
};

Postgres.prototype.visitPostfixUnary = function(unary) {
  var text = '(' + this.visit(unary.left) + ' ' + unary.operator + ')';
  return [text];
};

Postgres.prototype.visitBinary = function(binary) {
  var self = this;
  var text = '(' + this.visit(binary.left) + ' ' + binary.operator + ' ';
  if (Array.isArray(binary.right)) {
    text += '(' + binary.right.map(function (node) {
      return self.visit(node);
    }).join(', ') + ')';
  }
  else {
    text += this.visit(binary.right);
  }
  text += ')';
  return [text];
};

Postgres.prototype.visitTernary = function(ternary) {
  var self = this;
  var text = '(' + this.visit(ternary.left) + ' ' + ternary.operator + ' ';

  var visitPart = function(value) {
    var text = '';
    if (Array.isArray(value)) {
      text += '(' + value.map(function (node) {
        return self.visit(node);
      }).join(', ') + ')';
    }
    else {
      text += self.visit(value);
    }
    return text;
  };

  text += visitPart(ternary.middle);
  text += ' ' + ternary.separator + ' ';
  text += visitPart(ternary.right);

  text += ')';
  return [text];
};

Postgres.prototype.visitIn = function(binary) {
  var self = this;
  var text = '(';

  if (Array.isArray(binary.right)) {
    if (binary.right.length) {
      var params  = [];
      var hasNull = false;

      binary.right.forEach(function(node) {
        if (node.type === 'PARAMETER' && node._val === null) {
          hasNull = true;
        } else {
          params.push(self.visit(node));
        }
      });

      if (params.length) {
        text += this.visit(binary.left) + ' IN (' + params.join(', ') + ')';

        if (hasNull) {
          text += ' OR ' + this.visit(binary.left) + ' IS NULL';
        }
      } else { // implicitely has null
        text += this.visit(binary.left) + ' IS NULL';
      }
    } else {
      text += '1=0';
    }
  } else {
    text += this.visit(binary.left) + ' IN ' + this.visit(binary.right);
  }

  text += ')';
  return [text];
};

Postgres.prototype.visitNotIn = function(binary) {
  var self = this;
  var text = '(';

  if (Array.isArray(binary.right)) {
    if (binary.right.length) {
      var params  = [];
      var hasNull = false;

      binary.right.forEach(function(node) {
        if (node.type === 'PARAMETER' && node._val === null) {
          hasNull = true;
        } else {
          params.push(self.visit(node));
        }
      });

      if (params.length && hasNull) {
        text += 'NOT (';
        text += this.visit(binary.left) + ' IN (' + params.join(', ') + ')';
        text += ' OR ' + this.visit(binary.left) + ' IS NULL';
        text += ')';
      } else if (params.length) {
        text += this.visit(binary.left) + ' NOT IN (' + params.join(', ') + ')';
      } else { // implicitely has null
        text += this.visit(binary.left) + ' IS NOT NULL';
      }
    } else {
      text += '1=1';
    }
  } else {
    text += this.visit(binary.left) + ' NOT IN ' + this.visit(binary.right);
  }

  text += ')';
  return [text];
};

Postgres.prototype.visitCase = function(caseExp) {
  assert(caseExp.whenList.length == caseExp.thenList.length);

  var self = this;
  var text = '(CASE';

  this.visitingCase = true;

  for (var i = 0; i < caseExp.whenList.length; i++) {
    var whenExp = ' WHEN ' + this.visit(caseExp.whenList[i]);
    var thenExp = ' THEN ' + this.visit(caseExp.thenList[i]);
    text += whenExp + thenExp;
  }

  if (null != caseExp.else && undefined != caseExp.else) {
    text += ' ELSE ' + this.visit(caseExp.else);
  }

  this.visitingCase = false;

  text += ' END)';
  return [text];
}

Postgres.prototype.visitAt = function(at) {
  var text = '(' + this.visit(at.value) + ')[' + this.visit(at.index) + ']';
  return [text];
};

Postgres.prototype.visitSlice = function(slice) {
  var text = '(' + this.visit(slice.value) + ')';
  text += '[' + this.visit(slice.start) + ':' + this.visit(slice.end) + ']';
  return [text];
};

Postgres.prototype.visitContains = function(contains) {
  var text = this.visit(contains.value);
  text += ' @> ' + this.visit(contains.set);
  return [text];
};

Postgres.prototype.visitContainedBy = function(containedBy) {
  var text = this.visit(containedBy.value);
  text += ' <@ ' + this.visit(containedBy.set);
  return [text];
};

Postgres.prototype.visitOverlap = function(overlap) {
  var text = this.visit(overlap.value);
  text += ' && ' + this.visit(overlap.set);
  return [text];
};

Postgres.prototype.visitQuery = function(queryNode) {
  this._queryNode = queryNode;
  // need to sort the top level query nodes on visitation priority
  // so select/insert/update/delete comes before from comes before where
  var sortedNodes = [];
  var missingFrom = true;
  var hasFrom     = false;
  var actions = [];
  var targets = [];
  var filters = [];
  for(var i = 0; i < queryNode.nodes.length; i++) {
    var node = queryNode.nodes[i];
    switch(node.type) {
      case "SELECT":
      case "DELETE":
        actions.push(node);
        break;
      case "INDEXES":
      case "INSERT":
      case "UPDATE":
      case "CREATE":
      case "DROP":
      case "ALTER":
        actions.push(node);
        missingFrom = false;
        break;
      case "FROM":
        node.skipFromStatement = hasFrom;
        hasFrom = true;
        missingFrom = false;
        targets.push(node);
        break;
      default:
        filters.push(node);
        break;
    }
  }
  if(!actions.length) {
    // if no actions are given, guess it's a select
    actions.push(new Select().add('*'));
  }
  if(missingFrom) {
    targets.push(new From().add(queryNode.table));
  }
  // lazy-man sorting
  sortedNodes = actions.concat(targets).concat(filters);
  for(i = 0; i < sortedNodes.length; i++) {
    var res = this.visit(sortedNodes[i]);
    this.output = this.output.concat(res);
  }
  // implicit 'from'
  return this.output;
};

Postgres.prototype.visitSubquery = function(queryNode) {
  // create another query builder of the current class to build the subquery
  var subQuery = new this._myClass();

  // let the subquery modify this instance's params array
  subQuery.params = this.params;

  // pass on the disable parameter placeholder flag
  var previousFlagStatus = subQuery._disableParameterPlaceholders;
  subQuery._disableParameterPlaceholders = this._disableParameterPlaceholders;
  try {
    subQuery.visitQuery(queryNode);
  } finally {
    // restore the flag
    subQuery._disableParameterPlaceholders = previousFlagStatus;
  }

  var alias = queryNode.alias;
  return ['(' + subQuery.output.join(' ') + ')' + (alias ? ' ' + alias : '')];
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
  return [txt];
};

Postgres.prototype.visitColumn = function(columnNode) {
  var table = columnNode.table;
  var inInsertUpdateClause = this._visitedInsert || this._visitingUpdateTargetColumn;
  var inDdlClause = this._visitingAddColumn || this._visitingAlter || this._visitingCreate;
  var inSelectClause =
    this.visitingReturning ||
      (!this._selectOrDeleteEndIndex
        && !this._visitingWhere
        && !inInsertUpdateClause
        && !inDdlClause
        && !this.visitingCase
      );
  var txt = [];
  var closeParen = 0;
  if(inSelectClause && (!table.alias || !!columnNode.alias)) {
    if (columnNode.asArray) {
      closeParen++;
      txt.push(this._arrayAggFunctionName+'(');
    }

    if (!!columnNode.aggregator) {
      closeParen++;
      txt.push(columnNode.aggregator + '(');
    }

    if (columnNode.distinct === true) {
      closeParen++;
      txt.push('DISTINCT(');
    }
  }
  if(!inInsertUpdateClause && !this._visitingCreate && !this._visitingAlter) {
    if(table.alias) {
      txt.push(this.quote(table.alias));
    } else {
      if(table.getSchema()) {
        txt.push(this.quote(table.getSchema()));
        txt.push('.');
      }
      txt.push(this.quote(table.getName()));
    }
    txt.push('.');
  }
  if (columnNode.star) {
    var allCols = [];
    var hasAliases = false;
    for(var i = 0; i < table.columns.length; ++i){
      var col = table.columns[i];
      var aliased = col.name !== (col.alias || col.property);
      hasAliases = hasAliases || aliased;
      allCols.push(this.quote(col.name) + (aliased ? ' AS ' + this.quote(col.alias || col.property) : ''));
    }
    txt.push(hasAliases ? allCols.join(', ') : '*');
  }
  else {
    txt.push(this.quote(columnNode.name));
  }
  if(closeParen) {
    for(var i = 0; i < closeParen; i++) {
      txt.push(')');
    }
  }
  if(inSelectClause && (columnNode.alias || columnNode.property !== columnNode.name)) {
    txt.push(' AS ' + this.quote(columnNode.alias || columnNode.property));
  }
  if(this._visitingCreate || this._visitingAddColumn) {
    assert(columnNode.dataType, 'dataType missing for column ' + columnNode.name +
      ' (CREATE TABLE and ADD COLUMN statements require a dataType)');
    txt.push(' ' + columnNode.dataType);

    if (this._visitingCreate && columnNode.primaryKey) {
      // creating a column as a primary key
      txt.push(' PRIMARY KEY');
    }

    if (!!columnNode.references) {
      assert.equal(typeof (columnNode.references), 'object',
        'references is not a object for column ' + columnNode.name +
        ' (REFERENCES statements within CREATE TABLE and ADD COLUMN statements' +
        ' require refrences to be expressed as an object)');

      //Empty refrence objects are ok
      if (Object.keys(columnNode.references).length > 0){
        assert(columnNode.references.table, 'reference.table missing for column ' +
          columnNode.name +
          ' (REFERENCES statements within CREATE TABLE and ADD COLUMN statements' +
          ' require a table and column)');
        assert(columnNode.references.table, 'reference.column missing for column ' +
          columnNode.name +
          ' (REFERENCES statements within CREATE TABLE and ADD COLUMN statements' +
          ' require a table and column)');
        txt.push(' REFERENCES ' + columnNode.references.table + '(' +
          columnNode.references.column + ')');
      }
    }
  }
  return [txt.join('')];
};

Postgres.prototype.visitFunctionCall = function(functionCall) {
  var txt = functionCall.name + '(' + functionCall.nodes.map(this.visit.bind(this)).join(', ') + ')';
  return [txt];
};

Postgres.prototype.visitArrayCall = function(arrayCall) {
  var txt = 'ARRAY[' + arrayCall.nodes.map(this.visit.bind(this)).join(', ') + ']';
  return [txt];
};

Postgres.prototype.visitParameter = function(parameter) {
  // save the value into the parameters array
  var value = parameter.value();
  this.params.push(value);
  return parameter.isExplicit ? [] : [this._getParameterText(this.params.length, value)];
};

Postgres.prototype.visitDefault = function(parameter) {
  /* jshint unused: false */
  return ['DEFAULT'];
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

Postgres.prototype.visitRename = function(rename) {
  return ['RENAME TO ' + this.visit(rename.nodes[0])];
};

Postgres.prototype.visitIfExists = function() {
  return ['IF EXISTS'];
};

Postgres.prototype.visitIfNotExists = function() {
  return ['IF NOT EXISTS'];
};

Postgres.prototype.visitCascade = function() {
  return ['CASCADE'];
};

Postgres.prototype.visitRestrict = function() {
  return ['RESTRICT'];
};

Postgres.prototype.visitForUpdate = function() {
  return ['FOR UPDATE'];
};

Postgres.prototype.visitForShare = function() {
  return ['FOR SHARE'];
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

Postgres.prototype.visitLiteral = function(node) {
  var txt = [node.literal];
  if(node.alias) {
    txt.push(' AS ' + this.quote(node.alias));
  }
  return [txt.join('')];
};

Postgres.prototype.visitReturning = function(returning) {
  this.visitingReturning = true;
  var r = ['RETURNING', returning.nodes.map(this.visit.bind(this)).join(', ')];
  this.visitingReturning = false;

  return r;
};

Postgres.prototype.visitModifier = function(node) {
  return [node.type, node.count.type ? this.visit(node.count) : node.count];
};

Postgres.prototype.visitIndexes = function(node) {
  /* jshint unused: false */
  var tableName = this.visit(this._queryNode.table.toNode())[0];

  return [
    "SELECT relname",
    "FROM pg_class",
    "WHERE oid IN (",
    "SELECT indexrelid",
    "FROM pg_index, pg_class WHERE pg_class.relname=" + tableName.replace(/"/g, "'"),
    "AND pg_class.oid=pg_index.indrelid)"
  ].join(' ');
};

Postgres.prototype.visitCreateIndex = function(node) {
  if (!node.options.columns || (node.options.columns.length === 0)) {
    throw new Error('No columns defined!');
  }

  var tableName = this.visit(node.table.toNode());
  var result    = [ 'CREATE' ];

  if (node.options.type) {
    result.push(node.options.type.toUpperCase());
  }

  result = result.concat([ 'INDEX', this.quote(node.indexName()) ]);

  if (node.options.algorithm) {
    result.push("USING " + node.options.algorithm.toUpperCase());
  }

  result = result.concat([
    "ON",
    tableName,
    "(" + node.options.columns.reduce(function(result, col) {
      return result.concat(this.quote(col.name));
    }.bind(this), []) + ")"
  ]);

  if (node.options.parser) {
    result.push("WITH PARSER");
    result.push(node.options.parser);
  }

  return result;
};

Postgres.prototype.visitDropIndex = function(node) {
  var result = [ 'DROP INDEX' ];

  result.push(this.quote(node.options.indexName));
  result.push("ON");
  result.push(this.visit(node.table.toNode()));

  return result;
};

module.exports = Postgres;
