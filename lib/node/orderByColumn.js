'use strict';

var OrderByColumn = module.exports = require(__dirname).define({
  type: 'ORDER BY COLUMN',
  constructor: function(config) {
    this.column = config.column;
    this.direction = config.direction;
  }
});
