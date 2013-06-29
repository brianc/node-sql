'use strict';

var assert = require('assert');
var sliced = require('sliced');
var util   = require('util');

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
var Create          = require('./create');
var Drop            = require('./drop');
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
var Indexes         = require('./indexes');
var CreateIndex     = require('./createIndex');
var DropIndex       = require('./dropIndex');

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
    if (table) this.sql = table.sql;
  },
  select: function() {
    var select;
    if (this._select) {
      select = this._select;
    } else {
      select = this._select = new Select();
      this.add(select);
    }

    var args = getArrayOrArgsAsArray(arguments);
    select.addAll(args);

    // if this is a subquery then add reference to this column
    if (this.type === 'SUBQUERY') {
      for (var j = 0; j < select.nodes.length; j++) {
        var name = select.nodes[j].alias || select.nodes[j].name;
        var col = new Column(select.nodes[j]);
        col.name = name;
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
  from: function(tableNode) {
    var from = new From().add(tableNode);
    return this.add(from);
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
    if (this.whereClause) return this.and(node);
    this.whereClause = new Where(this.table);
    this.whereClause.add(node);
    return this.add(this.whereClause);
  },
  or: function(node) {
    this.whereClause.or(node);
    return this;
  },
  and: function(node) {
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
    if (arguments.length == 1 && !o.toNode && !o.forEach) {
      args = Object.keys(o).map(function(key) {
        return self.table.get(key).value(o[key]);
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
      var val = o[key];
      update.add(self.table.get(key).value(ParameterNode.getNodeOrParameterNode(val)));
    });
    return this.add(update);
  },
  delete: function(params) {
    var result = this.add(new Delete());
    if (params) {
      result = this.where(params);
    }
    return result;
  },
  returning: function() {
    var args = getArrayOrArgsAsArray(arguments);
    var returning = new Returning();
    returning.addAll(args);
    return this.add(returning);
  },

  create: function(indexName) {
    if (this.indexesCause) {
      var createIndex = new CreateIndex(this.table, indexName);
      this.add(createIndex);
      return createIndex;
    } else {
      return this.add(new Create());
    }
  },

  drop: function() {
    if (this.indexesCause) {
      var args = sliced(arguments);
      var dropIndex = new DropIndex(this.table, args);
      this.add(dropIndex);
      return dropIndex;
    } else {
      return this.add(new Drop());
    }
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
    this.nodes[0].add(new IfExists());
    return this;
  },

  ifNotExists: function() {
    this.nodes[0].add(new IfNotExists());
    return this;
  },

  indexes: function() {
    this.indexesCause = new Indexes({
      table: this.table
    });
    return this.add(this.indexesCause);
  }
});

module.exports = Query;
