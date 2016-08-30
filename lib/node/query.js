'use strict';

var _ = require('lodash');
var alias = require(__dirname + '/alias');
var assert = require('assert');
var sliced = require('sliced');
var util   = require('util');
var valueExpressionMixin = require(__dirname + '/valueExpression');

var Node            = require('./');
var Select          = require('./select');
var From            = require('./from');
var Where           = require('./where');
var OrderBy         = require('./orderBy');
var GroupBy         = require('./groupBy');
var Having          = require('./having');
var Insert          = require('./insert');
var Update          = require('./update');
var Delete          = require('./delete');
var Returning       = require('./returning');
var OnDuplicate     = require('./onDuplicate');
var ForUpdate       = require('./forUpdate');
var ForShare        = require('./forShare');
var Create          = require('./create');
var Drop            = require('./drop');
var Truncate        = require('./truncate');
var Distinct        = require('./distinct');
var DistinctOn      = require('./distinctOn');
var Alter           = require('./alter');
var AddColumn       = require('./addColumn');
var DropColumn      = require('./dropColumn');
var RenameColumn    = require('./renameColumn');
var Rename          = require('./rename');
var Column          = require('../column');
var ParameterNode   = require('./parameter');
var PrefixUnaryNode = require('./prefixUnary');
var IfExists        = require('./ifExists');
var IfNotExists     = require('./ifNotExists');
var Cascade         = require('./cascade');
var Restrict        = require('./restrict');
var Indexes         = require('./indexes');
var CreateIndex     = require('./createIndex');
var DropIndex       = require('./dropIndex');
var Table           = require('./table');
var CreateView     = require('./createView');
var JoinNode        = require('./join');

var Modifier = Node.define({
  constructor: function(table, type, count) {
    this.table = table;
    this.type = type;
    this.count = count;
  }
});

// get the first element of an arguments if it is an array, else return arguments as an array
var getArrayOrArgsAsArray = function(args) {
  if (util.isArray(args[0])) {
    return args[0];
  }
  return sliced(args);
};

var Query = Node.define({
  type: 'QUERY',

  constructor: function(table) {
    Node.call(this);
    this.table = table;
    if (table) {
      this.sql = table.sql;
    }
  },

  select: function() {
    var select;
    if (this._select) {
      select = this._select;
    } else {
      select = this._select = new Select();
      this.add(select);
    }

    //allow things like .select(a.star(), [ a.id, a.name ])
    //this will flatten them into a single array
    var args = sliced(arguments).reduce(function(cur, next) {
      if (util.isArray(next)) {
        return cur.concat(next);
      }

      cur.push(next);
      return cur;
    }, []);

    select.addAll(args);

    // if this is a subquery then add reference to this column
    if (this.type === 'SUBQUERY') {
      for (var j = 0; j < select.nodes.length; j++) {
        var name = select.nodes[j].alias || select.nodes[j].name;
        var col = new Column(select.nodes[j]);
        col.name = name;
        col.property = name;
        col.table = this;
        if (this[name] === undefined) {
          this[name] = col;
        }
      }
    }
    return this;
  },

  star: function() {
    assert(this.type === 'SUBQUERY', 'star() can only be used on a subQuery');
    return new Column({
      table: this,
      star: true
    });
  },

  from: function() {
    var tableNodes = arguments;

    if (Array.isArray(arguments[0])) {
      tableNodes = arguments[0];
    }

    for (var i=0; i<tableNodes.length; i++) {
      this.add(new From().add(tableNodes[i]));
    }

    return this;
  },

  leftJoin: function(other) {
    assert(this.type === 'SUBQUERY', 'leftJoin() can only be used on a subQuery');
    return new JoinNode('LEFT', this, other.toNode());
  },

  where: function(node) {
    if (arguments.length > 1) {
      // allow multiple where clause arguments
      var args = sliced(arguments);
      for (var i = 0; i < args.length; i++) {
        this.where(args[i]);
      }
      return this;
    }
    // calling #where twice functions like calling #where & then #and
    if (this.whereClause) {
      return this.and(node);
    }
    this.whereClause = new Where(this.table);
    this.whereClause.add(node);
    return this.add(this.whereClause);
  },

  or: function(node) {
    if (!this.whereClause) return this.where(node);
    this.whereClause.or(node);
    return this;
  },

  and: function(node) {
    if (!this.whereClause) return this.where(node);
    this.whereClause.and(node);
    return this;
  },

  order: function() {
    var args = getArrayOrArgsAsArray(arguments);
    var orderBy;
    if (this._orderBy) {
      orderBy = this._orderBy;
    } else {
      orderBy = this._orderBy = new OrderBy();
      this.add(orderBy);
    }
    orderBy.addAll(args);
    return this;
  },

  group: function() {
    var args = getArrayOrArgsAsArray(arguments);
    var groupBy = new GroupBy().addAll(args);
    return this.add(groupBy);
  },

  having: function() {
    var args = getArrayOrArgsAsArray(arguments);
    var having = new Having().addAll(args);
    return this.add(having);
  },

  insert: function(o) {
    var self = this;

    var args = sliced(arguments);
    // object literal
    if (arguments.length === 1 && !o.toNode && !o.forEach) {
      args = [];
      Object.keys(o).forEach(function(key) {
        var col = self.table.get(key);
        if(col && !col.autoGenerated)
          args.push(col.value(o[key]));
      });
    } else if (o.forEach) {
      o.forEach(function(arg) {
        return self.insert.call(self, arg);
      });
      return self;
    }

    if (self.insertClause) {
      self.insertClause.add(args);
      return self;
    } else {
      self.insertClause = new Insert();
      self.insertClause.add(args);
      return self.add(self.insertClause);
    }

  },

  update: function(o) {
    var self = this;
    var update = new Update();
    Object.keys(o).forEach(function(key) {
      var col = self.table.get(key);
      if(col && !col.autoGenerated) {
        var val = o[key];
        update.add(col.value(ParameterNode.getNodeOrParameterNode(val)));
      }
    });
    return this.add(update);
  },

  parameter: function(v) {
    var param = ParameterNode.getNodeOrParameterNode(v);
    param.isExplicit = true;
    return this.add(param);
  },

  delete: function(params) {
    var result;
    if (params) {
      var TableDefinition = require('../table');
      if (params instanceof TableDefinition || Array.isArray(params)) {
        //handle explicit delete queries:
        // e.g. post.delete(post).from(post) -> DELETE post FROM post
        // e.g. post.delete([post, user]).from(post) -> DELETE post, user FROM post
        if (Array.isArray(params)) {
          params = params.map(function(table) { return new Table(table); });
        } else {
          params = [ new Table(params) ];
        }
        result = this.add(new Delete().addAll(params));
      } else {
        //syntax sugar for post.delete().from(post).where(params)
        result = this.add(new Delete()).where(params);
      }
    } else{
      result = this.add(new Delete());
    }
    return result;
  },

  returning: function() {
    var returning = new Returning();
    if (arguments.length === 0)
      returning.add('*');
    else
      returning.addAll(getArrayOrArgsAsArray(arguments));

    return this.add(returning);
  },

  onDuplicate: function(o) {
    var self = this;

    var onDuplicate = new OnDuplicate();
    Object.keys(o).forEach(function(key) {
      var col = self.table.get(key);
      if(col && !col.autoGenerated)
        var val = o[key];
        onDuplicate.add(col.value(ParameterNode.getNodeOrParameterNode(val))); // jshint ignore:line
    });

    return self.add(onDuplicate);
  },


  forUpdate: function() {
    assert(typeof this._select !== 'undefined', 'FOR UPDATE can be used only in a select statement');
    this.add(new ForUpdate());
    return this;
  },

  forShare: function() {
    assert(typeof this._select !== 'undefined', 'FOR SHARE can be used only in a select statement');
    this.add(new ForShare());
    return this;
  },

  create: function(indexName) {
    if (this.indexesClause) {
      var createIndex = new CreateIndex(this.table, indexName);
      this.add(createIndex);
      return createIndex;
    } else {
      return this.add(new Create(this.table.isTemporary));
    }
  },

  drop: function() {
    if (this.indexesClause) {
      var args = sliced(arguments);
      var dropIndex = new DropIndex(this.table, args);
      this.add(dropIndex);
      return dropIndex;
    } else {
      return this.add(new Drop(this.table));
    }
  },

  truncate: function() {
    return this.add(new Truncate(this.table));
  },

  distinct: function() {
    return this.add(new Distinct());
  },

  distinctOn: function() {
    var distinctOn;
    if (this._distinctOn) {
      distinctOn = this._distinctOn;
    } else {
      var select = this.nodes.filter(function (node) {return node.type === 'SELECT';}).shift();

      distinctOn = this._distinctOn = new DistinctOn();
      select.add(distinctOn);
    }

    //allow things like .distinctOn(a.star(), [ a.id, a.name ])
    //this will flatten them into a single array
    var args = sliced(arguments).reduce(function(cur, next) {
      if (util.isArray(next)) {
        return cur.concat(next);
      }

      cur.push(next);
      return cur;
    }, []);

    distinctOn.addAll(args);

    return this;
  },

  alter: function() {
    return this.add(new Alter());
  },

  rename: function(newName) {
    var renameClause = new Rename();
    if (!newName.toNode) {
      newName = new Column({
        name: newName,
        table: this.table
      });
    }
    renameClause.add(newName.toNode());
    this.nodes[0].add(renameClause);
    return this;
  },

  addColumn: function(column, dataType) {
    var addClause = new AddColumn();
    if (!column.toNode) {
      column = new Column({
        name: column,
        table: this.table
      });
    }
    if (dataType) {
      column.dataType = dataType;
    }
    addClause.add(column.toNode());
    this.nodes[0].add(addClause);
    return this;
  },

  dropColumn: function(column) {
    var dropClause = new DropColumn();
    if (!column.toNode) {
      column = new Column({
        name: column,
        table: this.table
      });
    }
    dropClause.add(column.toNode());
    this.nodes[0].add(dropClause);
    return this;
  },

  renameColumn: function(oldColumn, newColumn) {
    var renameClause = new RenameColumn();
    if (!oldColumn.toNode) {
      oldColumn = new Column({
        name: oldColumn,
        table: this.table
      });
    }
    if (!newColumn.toNode) {
      newColumn = new Column({
        name: newColumn,
        table: this.table
      });
    }
    renameClause.add(oldColumn.toNode());
    renameClause.add(newColumn.toNode());
    this.nodes[0].add(renameClause);
    return this;
  },

  limit: function(count) {
    return this.add(new Modifier(this, 'LIMIT', count));
  },

  offset: function(count) {
    return this.add(new Modifier(this, 'OFFSET', count));
  },

  exists: function() {
    assert(this.type === 'SUBQUERY', 'exists() can only be used on a subQuery');
    return new PrefixUnaryNode({
      left: this,
      operator: "EXISTS"
    });
  },

  notExists: function() {
    assert(this.type === 'SUBQUERY', 'notExists() can only be used on a subQuery');
    return new PrefixUnaryNode({
      left: this,
      operator: "NOT EXISTS"
    });
  },

  ifExists: function() {
    this.nodes[0].unshift(new IfExists());
    return this;
  },

  ifNotExists: function() {
    this.nodes[0].unshift(new IfNotExists());
    return this;
  },

  cascade: function() {
    this.nodes[0].add(new Cascade());
    return this;
  },

  restrict: function() {
    this.nodes[0].add(new Restrict());
    return this;
  },

  indexes: function() {
    this.indexesClause = new Indexes({
      table: this.table
    });
    return this.add(this.indexesClause);
  },

  createView: function(viewName) {
    this.add(new CreateView(viewName));
    return this;
  }
});

// Here we are extending query with valueExpressions so that it's possible to write queries like
//   var query=sql.select(a.select(a.x.sum()).plus(b.select(b.y.sum()))
// which generates:
//   SELECT (SELECT SUM(a.x) FROM a) + (SELECT SUM(b.y) FROM b)
// We need to remove "or" and "and" from here because it conflicts with the already existing functionality of appending
// to the where clause like so:
//   var query=a.select().where(a.name.equals("joe")).or(a.name.equals("sam"))
var valueExpressions=valueExpressionMixin();
delete valueExpressions.or;
delete valueExpressions.and;
_.extend(Query.prototype, valueExpressions);

// Extend the query with the aliasMixin so that it's possible to write queries like
//   var query=sql.select(a.select(a.count()).as("column1"))
// which generates:
//   SELECT (SELECT COUNT(*) FROM a) AS "column1"
_.extend(Query.prototype, alias.AliasMixin);

module.exports = Query;
