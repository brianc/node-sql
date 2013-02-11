var Node = require(__dirname);
var Select = require(__dirname + '/select');
var From = require(__dirname + '/from');
var Where = require(__dirname + '/where');
var OrderBy = require(__dirname + '/orderBy');
var GroupBy = require(__dirname + '/groupBy');
var Insert = require(__dirname + '/insert');
var Update = require(__dirname + '/update');
var Delete = require(__dirname + '/delete');
var Returning = require(__dirname + '/returning');
var Create = require(__dirname + '/create');
var Drop = require(__dirname + '/drop');
var Alter = require(__dirname + '/alter');
var AddColumn = require(__dirname + '/addColumn');
var DropColumn = require(__dirname + '/dropColumn');
var RenameColumn = require(__dirname + '/renameColumn');
var Column = require(__dirname + '/../column');
var ParameterNode = require(__dirname + '/parameter');
var IfExists = require(__dirname + '/ifExists');
var IfNotExists = require(__dirname + '/ifNotExists');
var Column = require(__dirname + '/../column');

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
    this.table = table;
  },
  select: function() {
    var select = new Select();
    var args = Array.prototype.slice.call(arguments, 0);
    for(var i = 0; i < args.length; i++) {
      //arg could be a column instead of a node
      select.add(args[i]);
    }
    return this.add(select)
  },
  from: function(tableNode) {
    var from = new From().add(tableNode);
    return this.add(from);
  },
  where: function(node) {
    if (!node.toNode && typeof node == 'object')
      node = this._whereObject(node);

    //calling #where twice functions like calling #where & then #and
    if(this.whereClause) return this.and(node);
    this.whereClause = new Where();
    this.whereClause.add(node);
    return this.add(this.whereClause);
  },
  _whereObject: function(node) {
    var result;
    for (var colName in node) {
      var column = new Column({name: colName, table: this.table});
      var query = column.equals(node[colName]);

      if (!result)
        result = query;
      else
        result.and(query);
    }
    return result;
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
    var args = Array.prototype.slice.call(arguments, 0);
    var orderBy = new OrderBy();
    var nodes = args.forEach(function(arg) {
      orderBy.add(arg.toNode());
    });
    return this.add(orderBy);
  },
  group: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var groupBy = new GroupBy();
    var nodes = args.forEach(function(arg) {
      groupBy.add(arg.toNode());
    });
    return this.add(groupBy);
  },
  insert: function(o) {
    var self = this;

    var args = Array.prototype.slice.call(arguments, 0);
    //object literal
    if(arguments.length == 1 && !o["toNode"] && !o.forEach) {
      args = Object.keys(o).map(function(key) {
        return self.table[key].value(o[key]);
      })
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
      update.add(self.table[key].value(val && val.toNode ? val.toNode() : new ParameterNode(val)));
    });
    return this.add(update);
  },
  delete: function() {
    return this.add(new Delete());
  },
  returning: function() {
    var returning = new Returning();
    var args = Array.prototype.slice.call(arguments, 0);
    for(var i = 0; i < args.length; i++) {
      //arg could be a column instead of a node
      returning.add(args[i]);
    }
    return this.add(returning)
  },
  create: function() {
    return this.add(new Create());
  },
  drop: function() {
    return this.add(new Drop());
  },
  alter: function() {
    return this.add(new Alter());
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
  ifExists: function() {
    this.nodes[0].add(new IfExists());
    return this;
  },
  ifNotExists: function() {
    this.nodes[0].add(new IfNotExists());
    return this;
  },
  toQuery: function() {
    var Dialect = require(__dirname + '/../').dialect;
    return new Dialect().getQuery(this);
  }
})

module.exports = Query;
