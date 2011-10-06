var Node = require(__dirname);
var Select = require(__dirname + '/select');
var From = require(__dirname + '/from');
var Where = require(__dirname + '/where');
var OrderBy = require(__dirname + '/orderBy');
var Insert = require(__dirname + '/insert');
var Update = require(__dirname + '/update');

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
  toQuery: function() {
    var Dialect = require(__dirname + '/../').dialect;
    return new Dialect().getQuery(this);
  }
})

module.exports = Query;
