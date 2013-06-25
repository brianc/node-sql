'use strict';

var assert = require('assert');
var util = require('util');

var sliced = require('sliced');

var Node            = require(__dirname);
var Select          = require(__dirname + '/select');
var From            = require(__dirname + '/from');
var Where           = require(__dirname + '/where');
var OrderBy         = require(__dirname + '/orderBy');
var GroupBy         = require(__dirname + '/groupBy');
var Having          = require(__dirname + '/having');
var Insert          = require(__dirname + '/insert');
var Update          = require(__dirname + '/update');
var Delete          = require(__dirname + '/delete');
var Returning       = require(__dirname + '/returning');
var Create          = require(__dirname + '/create');
var Drop            = require(__dirname + '/drop');
var Alter           = require(__dirname + '/alter');
var AddColumn       = require(__dirname + '/addColumn');
var DropColumn      = require(__dirname + '/dropColumn');
var RenameColumn    = require(__dirname + '/renameColumn');
var Rename          = require(__dirname + '/rename');
var Column          = require(__dirname + '/../column');
var ParameterNode   = require(__dirname + '/parameter');
var PrefixUnaryNode = require(__dirname + '/prefixUnary');
var IfExists        = require(__dirname + '/ifExists');
var IfNotExists     = require(__dirname + '/ifNotExists');
var Indexes         = require(__dirname + '/indexes');
var CreateIndex     = require(__dirname + '/createIndex');
var DropIndex       = require(__dirname + '/dropIndex');

var Modifier = Node.define({
  constructor: function(table, type, count) {
    this.table = table;
    this.type = type;
    this.count = count;
  }
});

var Query = Node.define({
  type: 'QUERY',
  constructor: function(table) {
    Node.call(this);
    this.table = table;
    if (table) this.sql = table.sql;
  },
  select: function() {
    var select;
    if(this._select) {
      select = this._select;
    } else {
      select = this._select = new Select();
      this.add(select);
    }
    var args = sliced(arguments);
    if(util.isArray(args[0])) {
      args = args[0];
    }
    select.addAll(args);
    // if this is a subquery then add reference to this column
    if(this.type === 'SUBQUERY') {
      for(var j = 0; j < select.nodes.length; j++) {
        var name = select.nodes[j].alias || select.nodes[j].name;
        var col = new Column(select.nodes[j]);
        col.name = name;
        col.table = this;
        if( this[name] === undefined ) {
          this[name] = col;
        }
      }
    }
    return this;
  },
  star: function() {
    assert( this.type === 'SUBQUERY', 'star() can only be used on a subQuery');
    return new Column({table: this, star: true});
  },
  from: function(tableNode) {
    var from = new From().add(tableNode);
    return this.add(from);
  },
  where: function(node) {
    if(arguments.length > 1) {
      // allow multiple where clause arguments
      var args = sliced(arguments);
      for(var i = 0; i < args.length; i++) {
        this.where(args[i]);
      }
      return this;
    }
    // calling #where twice functions like calling #where & then #and
    if(this.whereClause) return this.and(node);
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
    var args = sliced(arguments);
    if(util.isArray(args[0])) {
      args = args[0];
    }
    var orderBy = new OrderBy().addAll(args);
    return this.add(orderBy);
  },
  group: function() {
    var args = sliced(arguments);
    if(util.isArray(args[0])) {
      args = args[0];
    }
    var groupBy = new GroupBy().addAll(args);
    return this.add(groupBy);
  },
  having: function() {
    var args = sliced(arguments);
    if (util.isArray(args[0])) {
      args = args[0];
    }
    var having = new Having().addAll(args);
    return this.add(having);
  },
  insert: function(o) {
    var self = this;

    var args = sliced(arguments);
    // object literal
    if(arguments.length == 1 && !o.toNode && !o.forEach) {
      args = Object.keys(o).map(function(key) {
        return self.table.get(key).value(o[key]);
      });
    } else if (o.forEach) {
      o.forEach(function (arg) {
        return self.insert.call(self, arg);
      });
      return self;
    }

    if (self.insertClause) {
      self.insertClause.add(args);
      return self;
    }
    else {
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
    if(params) {
      result = this.where(params);
    }
    return result;
  },
  returning: function() {
    var returning = new Returning();
    var args = sliced(arguments);
    if(util.isArray(args[0])) {
      args = args[0];
    }
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
      var args = Array.prototype.slice.call(arguments);
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
    if (!newName.toNode)
      newName = new Column({ name: newName, table: this.table});
    renameClause.add(newName.toNode());
    this.nodes[0].add(renameClause);
    return this;
  },
  addColumn: function(column, dataType) {
    var addClause = new AddColumn();
    if (!column.toNode)
      column = new Column({name: column, table: this.table});
    if (dataType)
      column.dataType = dataType;
    addClause.add(column.toNode());
    this.nodes[0].add(addClause);
    return this;
  },
  dropColumn: function(column) {
    var dropClause = new DropColumn();
    if (!column.toNode)
      column = new Column({name: column, table: this.table});
    dropClause.add(column.toNode());
    this.nodes[0].add(dropClause);
    return this;
  },

  renameColumn: function(oldColumn, newColumn) {
    var renameClause = new RenameColumn();
    if (!oldColumn.toNode)
      oldColumn = new Column({name: oldColumn, table: this.table});
    if (!newColumn.toNode)
      newColumn = new Column({name: newColumn, table: this.table});
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
    this.indexesCause = new Indexes({ table: this.table });
    return this.add(this.indexesCause);
  }
});

module.exports = Query;
