'use strict';

var Node = require(__dirname);

module.exports = Node.define({
	type: 'ON DUPLICATE KEY UPDATE'
});