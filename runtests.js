var childProcess = require("child_process")
var path = require("path")

var env = process.env
env.NODE_ENV = "test"

var options={
  env:env,
  stdio:"inherit"
}

var command = path.join(".","node_modules",".bin","mocha")
try {
childProcess.execSync(command,options)
}catch(ex){}
