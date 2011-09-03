var Node = require(__dirname);
var Select = require(__dirname + '/select');
var From = require(__dirname + '/from');
var Where = require(__dirname + '/where');

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
  toQuery: function() {
    var Dialect = require(__dirname + '/../').dialect;
    return new Dialect().getQuery(this);
  }
})

module.exports = Query;
