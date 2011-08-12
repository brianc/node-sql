var fs = require('fs');
fs.readdir(__dirname, function(err, res) {
  res.forEach(function(file) {
    if(file === 'index.js') return;
    var name = __dirname + '/' + file.split('.')[0];
    console.log(file);
    require(name);
  })
})
