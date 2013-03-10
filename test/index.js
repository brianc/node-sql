'use strict';

var fs = require('fs');
var path = require('path');

var testDir = path.dirname(require.main.filename);

var directories = [
  testDir,
  testDir + '/dialects'
];

directories.forEach(function (d) {
  var files = fs.readdirSync(d);
  /*jshint boss: true */
  for(var i = 0, file; file = files[i]; i++) {
    var filePath = path.join(d, file);
    console.log(filePath);
    require(filePath);
  }
});
