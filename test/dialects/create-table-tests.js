'use strict';

var Table = require(__dirname + '/../../lib/table');
var Harness = require('./support');

var group = Table.define({
  name: 'group',
  columns: [{
    name: 'id',
    dataType: 'varchar(100)'
  }, {
    name: 'user_id',
    dataType: 'varchar(100)'
  }]
});

Harness.test({
  query : group.create(),
  pg    : 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))',
  sqlite: 'CREATE TABLE "group" ("id" varchar(100), "user_id" varchar(100))',
  mysql : 'CREATE TABLE `group` (`id` varchar(100), `user_id` varchar(100))',
  params: []
});

Harness.test({
  query : group.create().ifNotExists(),
  pg    : 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))',
  sqlite: 'CREATE TABLE IF NOT EXISTS "group" ("id" varchar(100), "user_id" varchar(100))',
  mysql : 'CREATE TABLE IF NOT EXISTS `group` (`id` varchar(100), `user_id` varchar(100))',
  params: []
});