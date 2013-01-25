var fs = require('fs');
var path = require('path');

var testDir = path.dirname(require.main.filename);

var directories = [
  testDir,
  testDir + '/postgres'
];

directories.forEach(function (d) {
  fs.readdir(d, function(err, files) {
    if(err) throw err;
    for(var i = 0, file; file = files[i]; i++) {
      var filePath = path.join(d, file);
      require(filePath);
    }
  });
});
