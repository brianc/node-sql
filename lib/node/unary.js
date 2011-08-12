module.exports = require(__dirname).define({
  type: 'UNARY',
  constructor: function(config) {
    this.left = config.left,
    this.operator = config.operator
  }
});
