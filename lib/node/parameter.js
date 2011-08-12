module.exports = require(__dirname).define({
  type: 'PARAMETER',
  constructor: function(val) {
    this._val = val;
  },
  value: function() {
    return this._val;
  }
});
