'use strict';

var Node          = require(__dirname);
var ParameterNode = require(__dirname + '/parameter');

var IntervalNode = Node.define({
  type: 'INTERVAL',
  constructor: function(args) {
    Node.call(this);
    var interval = args[0] || {};
    this.years = interval.years;
    this.months = interval.months;
    this.days = interval.days;
    this.hours = interval.hours;
    this.minutes = interval.minutes;
    this.seconds = interval.seconds;
  }
});

module.exports = IntervalNode;

