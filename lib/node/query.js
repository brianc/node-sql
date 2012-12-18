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
    this.where = new Where();
    this.where.add(node);
    return this.add(this.where);
  },
  or: function(node) {
    this.where.or(node);
    return this;
  },
  and: function(node) {
    this.where.and(node);
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
    if(arguments.length == 1 && !o["toNode"]) {
      args = Object.keys(o).map(function(key) {
        return self.table[key].value(o[key]);
      })
    }
    var insert = new Insert();
    args.forEach(function(arg) {
      insert.add(arg);
    });
    return this.add(insert);
  },
  update: function(o) {
    var self = this;
    var update = new Update();
    Object.keys(o).forEach(function(key) {
      update.add(self.table[key].value(o[key]));
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
  limit: function(count) {
    return this.add(new Modifier(this, 'LIMIT', count));
  },
  offset: function(count) {
    return this.add(new Modifier(this, 'OFFSET', count));
  },
  toQuery: function() {
    var Dialect = require(__dirname + '/../').dialect;
    return new Dialect().getQuery(this);
  }
})

module.exports = Query;
