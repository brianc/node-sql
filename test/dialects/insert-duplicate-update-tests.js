'use strict';

var Harness = require('./support');
var post = Harness.definePostTable();
var user = Harness.defineUserTable();


Harness.test({
	query: post.insert({
		content: 'test',
		userId: 2
	}).onDuplicateKeyUpdate({
		content: 'test123'
	}),
	pg: {
		throws: true
	},
	sqlite: {
		throws: true
	},
	mysql: {
		text: 'INSERT INTO `post` (`content`, `userId`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `content` = ?',
		string: 'INSERT INTO `post` (`content`, `userId`) VALUES (\'test\', 2) ON DUPLICATE KEY UPDATE `content` = \'test123\''
	},
	mssql: {
		throws: true
	},
	params: ['test', 2, 'test123']
});