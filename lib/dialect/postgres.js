'use strict';

var _      = require('lodash');
var assert = require('assert');
var From   = require('../node/from');
var Select = require('../node/select');
var Table  = require('../table');

var Postgres = function(config) {
  this.output = [];
  this.params = [];
  this.config = config || {};
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

Postgres.prototype._getParameterValue = function(value, quoteChar) {
  // handle primitives
  if (null === value) {
    value = 'NULL';
  } else if ('boolean' === typeof value) {
    value = value ? 'TRUE' : 'FALSE';
  } else if ('number' === typeof value) {
    // number is just number
    value = value;
  } else if ('string' === typeof value) {
    // string uses single quote by default
    value = this.quote(value, quoteChar || "'");
  } else if ('object' === typeof value) {
    if (Array.isArray(value)) {
      if (this._myClass === Postgres) {
        // naive check to see if this is an array of objects, which
        // is handled differently than an array of primitives
        if (value.length && 'object' === typeof value[0] &&
            !_.isFunction(value[0].toISOString) &&
            !Array.isArray(value[0])) {
            value = "'" + JSON.stringify(value) + "'";
        } else {
            var self = this;
            value = value.map(function (item) {
                // In a Postgres array, strings must be double-quoted
                return self._getParameterValue(item, '"');
            });
            value = '\'{' + value.join(',') + '}\'';
        }
      } else {
        value = _.map(value, this._getParameterValue.bind(this));
        value = '(' + value.join(', ') + ')';
      }
    } else if (value instanceof Date) {
      // Date object's default toString format does not get parsed well
      // Handle dates using toISOString
      value = this._getParameterValue(value.toISOString());
    } else if (Buffer.isBuffer(value)) {
      value = this._getParameterValue('\\x' + value.toString('hex'));
    } else {
      // rich object represent with string
      var strValue = value.toString();
      value = strValue === '[object Object]' ? this._getParameterValue(JSON.stringify(value)) : this._getParameterValue(strValue);
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

  //if is a create view, must replace paramaters with values
  if (this.output.indexOf('CREATE VIEW') > -1) {
    var previousFlagStatus = this._disableParameterPlaceholders;
    this._disableParameterPlaceholders = true;
    this.output = [];
    this.output = this.visit(queryNode);
    this.params = [];
    this._disableParameterPlaceholders = previousFlagStatus;
  }

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
    case 'TRUNCATE'        : return this.visitTruncate(node);
    case 'DISTINCT'        : return this.visitDistinct(node);
    case 'DISTINCT ON'     : return this.visitDistinctOn(node);
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
    case 'ONDUPLICATE'     : return this.visitOnDuplicate(node);
    case 'ONCONFLICT'      : return this.visitOnConflict(node);
    case 'FOR UPDATE'      : return this.visitForUpdate();
    case 'FOR SHARE'       : return this.visitForShare();
    case 'TABLE'           : return this.visitTable(node);
    case 'COLUMN'          : return this.visitColumn(node);
    case 'FOREIGN KEY'     : return this.visitForeignKey(node);
    case 'JOIN'            : return this.visitJoin(node);
    case 'LITERAL'         : return this.visitLiteral(node);
    case 'TEXT'            : return node.text;
    case 'PARAMETER'       : return this.visitParameter(node);
    case 'DEFAULT'         : return this.visitDefault(node);
    case 'IF EXISTS'       : return this.visitIfExists();
    case 'IF NOT EXISTS'   : return this.visitIfNotExists();
    case 'OR IGNORE'       : return this.visitOrIgnore();
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
    case 'CREATE VIEW'     : return this.visitCreateView(node);
    case 'INTERVAL'        : return this.visitInterval(node);

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
Postgres.prototype._aliasText = ' AS ';

Postgres.prototype.quote = function(word, quoteCharacter) {
  var q;
  if (quoteCharacter) {
    // use the specified quote character if given
    q = quoteCharacter;
  } else {
    q = this._quoteCharacter;
  }
  // handle square brackets specially
  if (q=='['){
    return '['+word+']';
  } else {
    return q + word.replace(new RegExp(q,'g'),q+q) + q;
  }
};

Postgres.prototype.visitSelect = function(select) {
  var result = ['SELECT'];

  if (select.isDistinct) result.push('DISTINCT');

  var distinctOnNode = select.nodes.filter(function (node) {return node.type === 'DISTINCT ON';}).shift();
  var nonDistinctOnNodes = select.nodes.filter(function (node) {return node.type !== 'DISTINCT ON';});

  if (distinctOnNode) {
    result.push(this.visit(distinctOnNode));
  }

  result.push(nonDistinctOnNodes.map(this.visit.bind(this)).join(', '));

  this._selectOrDeleteEndIndex = this.output.length + result.length;

  return result;
};

Postgres.prototype.visitInsert = function(insert) {
  var self = this;
  // don't use table.column for inserts
  this._visitedInsert = true;

  var result = ['INSERT'];
  result = result.concat(insert.nodes.map(this.visit.bind(this)));
  result.push('INTO ' + this.visit(this._queryNode.table.toNode()));
  result.push('(' + insert.columns.map(this.visit.bind(this)).join(', ') + ')');

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

  this._visitedInsert = false;

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
  var foreign_key_nodes = table.foreignKeys;

   var result = ['CREATE TABLE'];
  if (create.options.isTemporary) result=['CREATE TEMPORARY TABLE'];
  result = result.concat(create.nodes.map(this.visit.bind(this)));
  result.push(this.visit(table.toNode()));
  var primary_col_nodes = col_nodes.filter(function(n) {
    return n.primaryKey;
  });
  this._visitCreateCompoundPrimaryKey = primary_col_nodes.length > 1;
  var colspec = '(' + col_nodes.map(this.visit.bind(this)).join(', ');
  if (this._visitCreateCompoundPrimaryKey) {
    colspec += ', PRIMARY KEY (';
    colspec += primary_col_nodes.map(function(node) {
      return this.quote(node.name);
    }.bind(this)).join(', ');
    colspec += ')';
  }
  if(foreign_key_nodes.length > 0) {
    colspec += ', ' + foreign_key_nodes.map(this.visit.bind(this)).join(', ');
  }
  colspec += ')';
  result.push(colspec);
  this._visitCreateCompoundPrimaryKey = false;
  this._visitingCreate = false;
  return result;
};

Postgres.prototype.visitDrop = function(drop) {
  // don't auto-generate from clause
  var result = ['DROP TABLE'];
  result = result.concat(drop.nodes.map(this.visit.bind(this)));
  return result;
};

Postgres.prototype.visitTruncate = function(truncate) {
  var result = ['TRUNCATE TABLE'];
  result = result.concat(truncate.nodes.map(this.visit.bind(this)));
  return result;
};

Postgres.prototype.visitDistinct = function(truncate) {
  // Nothing to do here since it's handled in the SELECT clause
  return [];
};

Postgres.prototype.visitDistinctOn = function(distinctOn) {
  return ['DISTINCT ON('+distinctOn.nodes.map(this.visit.bind(this)).join(', ')+')'];
};

Postgres.prototype.visitAlias = function(alias) {
  var result = [this.visit(alias.value) + this._aliasText + this.quote(alias.alias)];
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
  this._visitingCast = true;
  var result = ['CAST(' + this.visit(cast.value) + ' AS ' + cast.dataType + ')'];
  this._visitingCast = false;
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
  if (this._myClass === Postgres && this.config.nullOrder) {
      result.push('NULLS ' + this.config.nullOrder.toUpperCase());
  }
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

  binary.left.property = binary.left.name;
  binary.right.property = binary.right.name;

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

  if (null !== caseExp.else && undefined !== caseExp.else) {
    text += ' ELSE ' + this.visit(caseExp.else);
  }

  this.visitingCase = false;

  text += ' END)';
  return [text];
};

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
  if (this._queryNode) return this.visitSubquery(queryNode,dontParenthesizeSubQuery(this._queryNode));
  this._queryNode = queryNode;
  // need to sort the top level query nodes on visitation priority
  // so select/insert/update/delete comes before from comes before where
  var missingFrom = true;
  var hasFrom     = false;
  var createView;
  var isSelect     = false;
  var actions = [];
  var targets = [];
  var filters = [];
  for(var i = 0; i < queryNode.nodes.length; i++) {
    var node = queryNode.nodes[i];
    switch(node.type) {
      case "SELECT":
        isSelect = true; // jshint ignore:line
      case "DELETE":
        actions.push(node);
        break;
      case "INDEXES":
      case "INSERT":
      case "UPDATE":
      case "CREATE":
      case "DROP":
      case "TRUNCATE":
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
      case "CREATE VIEW":
        createView = node;
        break;
      default:
        filters.push(node);
        break;
    }
  }
  if(!actions.length) {
    // if no actions are given, guess it's a select
    actions.push(new Select().add('*'));
    isSelect = true;
  }
  if(missingFrom && queryNode.table instanceof Table) {
	  // the instanceof handles the situation where a sql.select(some expression) is used and there should be no FROM clause
    targets.push(new From().add(queryNode.table));
  }
  if (createView) {
    if (isSelect) {
      actions.unshift(createView);
    } else {
      throw new Error('Create View requires a Select.');
    }
  }
  return this.visitQueryHelper(actions,targets,filters);
};

/**
 * We separate out this part of query building so it can be overridden by other implementations.
 *
 * @param {Node[]} actions
 * @param {Node[]} targets
 * @param {Node[]} filters
 * @returns {String[]}
 */
Postgres.prototype.visitQueryHelper=function(actions,targets,filters){
  this.handleDistinct(actions, filters);
  // lazy-man sorting
  var sortedNodes = actions.concat(targets).concat(filters);
  for(var i = 0; i < sortedNodes.length; i++) {
    var res = this.visit(sortedNodes[i]);
    this.output = this.output.concat(res);
  }
  // implicit 'from'
  return this.output;
};

Postgres.prototype.visitSubquery = function(queryNode,dontParenthesize) {
  // create another query builder of the current class to build the subquery
  var subQuery = new this._myClass(this.config);

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
  if (dontParenthesize) {
  	return [subQuery.output.join(' ') + (alias ? ' ' + this.quote(alias) : '')];
  }
  return ['(' + subQuery.output.join(' ') + ')' + (alias ? ' ' + this.quote(alias) : '')];
};

Postgres.prototype.visitTable = function(tableNode) {
  var table = tableNode.table;
  var txt="";
  if(table.getSchema()) {
    txt = this.quote(table.getSchema());
    txt += '.';
  }
  txt += this.quote(table.getName());
  if(typeof table.alias === 'string') {
    txt += this._aliasText + this.quote(table.alias);
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
        && !this._visitingWhere   // jshint ignore:line
        && !inInsertUpdateClause  // jshint ignore:line
        && !inDdlClause           // jshint ignore:line
        && !this.visitingCase     // jshint ignore:line
        && !this._visitingJoin    // jshint ignore:line
      );
  var inFunctionCall = this._visitingFunctionCall;
  var inCast = this._visitingCast;
  var txt = [];
  var closeParen = 0;
  if(inSelectClause && (table && !table.alias || !!columnNode.alias)) {
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
  if(!inInsertUpdateClause && !this.visitingReturning && !this._visitingCreate && !this._visitingAlter && !columnNode.subfieldContainer) {
    if (table) {
      if (typeof table.alias === 'string') {
        txt.push(this.quote(table.alias));
      } else {
        if (table.getSchema()) {
          txt.push(this.quote(table.getSchema()));
          txt.push('.');
        }
        txt.push(this.quote(table.getName()));
      }
      txt.push('.');
    }
  }
  if (columnNode.star) {
    var allCols = [];
    var hasAliases = false;
    if(columnNode.aggregator !== 'COUNT') {
      var tableName = txt.join('');
      for (var i = 0; i < table.columns.length; ++i) {
        var col = table.columns[i];
        var aliased = col.name !== (col.alias || col.property);
        hasAliases = hasAliases || aliased;
        allCols.push(tableName + this.quote(col.name) + (aliased ? this._aliasText + this.quote(col.alias || col.property) : ''));
      }
    }
    if(hasAliases) {
      txt = [allCols.join(', ')];
    }
    else {
      txt.push('*');
    }
  }
  else if (columnNode.isConstant) {
    // this injects directly into SELECT statement rather than creating a parameter
    //   txt.push(this._getParameterValue(columnNode.literalValue))
    // currently thinking it is better to generate a parameter
    var value = columnNode.constantValue;
    this.params.push(value);
    txt.push(this._getParameterText(this.params.length, value));
  }
  else {
    if (columnNode.subfieldContainer) {
      txt.push('(' + this.visitColumn(columnNode.subfieldContainer) + ').');
    }
    txt.push(this.quote(columnNode.name));
  }
  if(closeParen) {
    for(var j = 0; j < closeParen; j++) {
      txt.push(')');
    }
  }
  if(inSelectClause && !inFunctionCall && !inCast && (columnNode.alias || columnNode.property !== columnNode.name)) {
    txt.push(this._aliasText + this.quote(columnNode.alias || columnNode.property));
  }
  if(this._visitingCreate || this._visitingAddColumn) {
    assert(columnNode.dataType, 'dataType missing for column ' + columnNode.name +
      ' (CREATE TABLE and ADD COLUMN statements require a dataType)');
    txt.push(' ' + columnNode.dataType);

    if (this._visitingCreate) {
      if (columnNode.primaryKey && !this._visitCreateCompoundPrimaryKey) {
        // creating a column as a primary key
        txt.push(' PRIMARY KEY');
      } else if (columnNode.notNull) {
        txt.push(' NOT NULL');
      }
      if (!columnNode.primaryKey && columnNode.unique) {
        txt.push(' UNIQUE');
      }
      if (columnNode.defaultValue !== undefined) {
        txt.push(' DEFAULT ' + this._getParameterValue(columnNode.defaultValue));
      }
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
        assert(columnNode.references.column, 'reference.column missing for column ' +
          columnNode.name +
          ' (REFERENCES statements within CREATE TABLE and ADD COLUMN statements' +
          ' require a table and column)');
        txt.push(' REFERENCES ');
        if(columnNode.references.schema) {
          txt.push(this.quote(columnNode.references.schema) + '.');
        }
        txt.push(this.quote(columnNode.references.table) + '(' +
          this.quote(columnNode.references.column) + ')');

        var onDelete = columnNode.references.onDelete;
        if (onDelete) onDelete = onDelete.toUpperCase();
        if (onDelete === 'CASCADE' || onDelete === 'RESTRICT' || onDelete === 'SET NULL' || onDelete === 'SET DEFAULT' || onDelete === 'NO ACTION') {
          txt.push(' ON DELETE ' + onDelete);
        }
        var onUpdate = columnNode.references.onUpdate;
        if (onUpdate) onUpdate = onUpdate.toUpperCase();
        if (onUpdate === 'CASCADE' || onUpdate === 'RESTRICT' || onUpdate === 'SET NULL' || onUpdate === 'SET DEFAULT' || onUpdate === 'NO ACTION') {
          txt.push(' ON UPDATE ' + onUpdate);
        }
        var constraint = columnNode.references.constraint;
        if (constraint) {
          constraint = ' ' + constraint.toUpperCase();
          txt.push(constraint);
        }
      }
    }
  }
  return [txt.join('')];
};

Postgres.prototype.visitForeignKey = function(foreignKeyNode)
{
  var txt = [];
  if(this._visitingCreate) {
    assert(foreignKeyNode.table, 'Foreign table missing for table reference');
    assert(foreignKeyNode.columns, 'Columns missing for table reference');
    if(foreignKeyNode.refColumns !== undefined) {
      assert.equal(foreignKeyNode.columns.length, foreignKeyNode.refColumns.length, 'Number of local columns and foreign columns differ in table reference');
    }
    if(foreignKeyNode.name !== undefined) {
      txt.push('CONSTRAINT ' + this.quote(foreignKeyNode.name) + ' ');
    }
    txt.push('FOREIGN KEY ( ');
    for(var i = 0; i < foreignKeyNode.columns.length; i++) {
      if(i>0) {
        txt.push(', ');
      }
      txt.push(this.quote(foreignKeyNode.columns[i]));
    }
    txt.push(' ) REFERENCES ');
    if(foreignKeyNode.schema !== undefined) {
      txt.push(this.quote(foreignKeyNode.schema) + '.');
    }
    txt.push(this.quote(foreignKeyNode.table));
    if(foreignKeyNode.refColumns !== undefined) {
      txt.push(' ( ');
      for(i = 0; i < foreignKeyNode.refColumns.length; i++) {
        if(i>0) {
          txt.push(', ');
        }
        txt.push(this.quote(foreignKeyNode.refColumns[i]));
      }
      txt.push(' )');
    }
    var onDelete = foreignKeyNode.onDelete;
    if(onDelete) {
      onDelete = onDelete.toUpperCase();
      if(onDelete === 'CASCADE' || onDelete === 'RESTRICT' || onDelete === 'SET NULL' || onDelete === 'SET DEFAULT' || onDelete === 'NO ACTION') {
        txt.push(' ON DELETE ' + onDelete);
      }
    }
    var onUpdate = foreignKeyNode.onUpdate;
    if(onUpdate) {
      onUpdate = onUpdate.toUpperCase();
      if(onUpdate === 'CASCADE' || onUpdate === 'RESTRICT' || onUpdate === 'SET NULL' || onUpdate === 'SET DEFAULT' || onUpdate === 'NO ACTION') {
        txt.push(' ON UPDATE ' + onUpdate);
      }
    }
    if(foreignKeyNode.constraint) {
      txt.push(' ' + foreignKeyNode.constraint.toUpperCase());
    }
  }
  return [txt.join('')];
};

Postgres.prototype.visitFunctionCall = function(functionCall) {
  this._visitingFunctionCall = true;
  var _this = this;

  function _extract() {
    var nodes = functionCall.nodes.map(_this.visit.bind(_this));
    if (nodes.length != 1) throw new Error('Not enough parameters passed to ' + functionCall.name + ' function');
    var txt = 'EXTRACT(' + functionCall.name + ' FROM ' + (nodes[0]+'') + ')';
    return txt;
  }

  var txt = "";
  // Override date functions since postgres (and others) uses extract
  if (['YEAR', 'MONTH', 'DAY', 'HOUR'].indexOf(functionCall.name) >= 0) txt = _extract();
  // Override CURRENT_TIMESTAMP function to remove parens
  else if ('CURRENT_TIMESTAMP' == functionCall.name) txt = functionCall.name;
  else txt = functionCall.name + '(' + functionCall.nodes.map(this.visit.bind(this)).join(', ') + ')';
  this._visitingFunctionCall = false;
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

Postgres.prototype.visitOrIgnore = function() {
  throw new Error('PostgreSQL does not allow orIgnore clause.');
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
  this._visitingJoin = true;
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
    txt.push(this._aliasText + this.quote(node.alias));
  }
  return [txt.join('')];
};

Postgres.prototype.visitReturning = function(returning) {
  this.visitingReturning = true;
  var r = ['RETURNING', returning.nodes.map(this.visit.bind(this)).join(', ')];
  this.visitingReturning = false;

  return r;
};

Postgres.prototype.visitOnDuplicate = function(onDuplicate) {
  throw new Error('PostgreSQL does not allow onDuplicate clause.');
};

Postgres.prototype.visitOnConflict = function(onConflict) {
  var result = ['ON CONFLICT'];
  var columns = [];
  var updateClause = [], i, col;
  var table = this._queryNode.table;
  if(onConflict.constraint)
    result.push(['ON CONSTRAINT', this.quote(onConflict.constraint)].join(' '));
  else if(onConflict.columns) {
    for(i=0; i < onConflict.columns.length; i++) {
      columns.push(this.quote(table.getColumn(onConflict.columns[i]).name));
    }
    result.push( '(' + columns.join(', ') + ')' );
  }
    
  if(onConflict.update){
    updateClause.push("DO UPDATE SET");
    var update = onConflict.update;
    var setClause = [];
    for(i=0; i<update.length; i++) {
      col = this.quote(table.getColumn(update[i]).name);
      setClause.push(col + ' = EXCLUDED.' + col);
    }
    updateClause.push(setClause.join(', '));
  }
  else 
    updateClause.push('DO NOTHING');

  result.push(updateClause.join(' '));
  return result; 
};

Postgres.prototype.visitModifier = function(node) {
  return [node.type, node.count.type ? this.visit(node.count) : node.count];
};

Postgres.prototype.visitIndexes = function(node) {
  /* jshint unused: false */
  var tableName = this._queryNode.table.getName();
  var schemaName = this._queryNode.table.getSchema() || "public";

  return [
    "SELECT relname",
    "FROM pg_class",
    "WHERE oid IN (",
    "SELECT indexrelid",
    "FROM pg_index, pg_class WHERE pg_class.relname='" + tableName + "'",
    "AND pg_class.relnamespace IN (SELECT pg_namespace.oid FROM pg_namespace WHERE nspname = '" + schemaName + "')",
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
      var column = col.name ? col.name : col.value.name;
      var direction = col.direction ? ' ' + col.direction.text : '';
      var res = result.concat(this.quote(column) + direction);
      return res;
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

  result.push(this.quote(node.table.getSchema() || "public") + "." + this.quote(node.options.indexName));

  return result;
};

Postgres.prototype.visitCreateView = function(createView) {
  var result = ['CREATE VIEW', this.quote(createView.options.viewName), 'AS'];
  return result;
};

Postgres.prototype.visitInterval = function(interval) {
  var parameter = '';
  function _add(n, unit) {
    if(!_.isNumber(n)) return;
    if(parameter !== '') {
      parameter += ' ';
    }
    parameter += n + ' ' + unit;
  }
  _add(interval.years, 'YEAR');
  _add(interval.months, 'MONTH');
  _add(interval.days, 'DAY');
  _add(interval.hours, 'HOUR');
  _add(interval.minutes, 'MINUTE');
  _add(interval.seconds, 'SECOND');
  if(parameter === '') parameter = '0 SECOND';
  var result = "INTERVAL '" + parameter + "'";
  return result;
};

/**
 * Broken out as a separate function so that dialects that derive from this class can still use this functionality.
 *
 * @param {Node[]} list
 * @param {String} type
 * @returns {Object|undefined} {index:number, node:Node}
 */
Postgres.prototype.findNode=function(list,type) {
  for (var i= 0, len=list.length; i<len; i++) {
    var n=list[i];
    if (n.type==type) return {index:i,node:n};
  }
  return undefined;
};

/**
 * pulls the DISTINCT node out of the filters and flags the SELECT node that it should be distinct.
 * Broken out as a separate function so that dialects that derive from this class can still use this functionality.
 */
Postgres.prototype.handleDistinct = function(actions,filters) {
  var distinctNode = this.findNode(filters,"DISTINCT");
  //if (!distinctNode) distinctNode = _findNode(targets,"DISTINCT");
  //if (!distinctNode) distinctNode = _findNode(actions,"DISTINCT");
  if (!distinctNode) return;
  var selectInfo = this.findNode(actions,"SELECT");
  if (!selectInfo) return; // there should be one by now, I think
  // mark the SELECT node that it's distinct
  selectInfo.node.isDistinct = true;
};

/**
 * If the parent of the subquery is an INSERT we don't want to parenthesize.
 * This happens when you create the query like so:
 *
 * var query=post.insert(post.id)
 * var select=user.select(user.id)
 * query.add(select)
 *
 * @param parentQuery
 * @returns {boolean}
 */
function dontParenthesizeSubQuery(parentQuery){
	if (!parentQuery) return false;
	if (parentQuery.nodes.length === 0) return false;
	if (parentQuery.nodes[0].type != 'INSERT') return false;
	return true;
}

module.exports = Postgres;
