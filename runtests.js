var childProcess = require("child_process")
var path = require("path")

var env = process.env
env.NODE_ENV = "test"

var options = {
  env: env
}

var command = path.join(".", "node_modules", ".bin", "mocha")
if (process.platform == "win32") command += ".cmd"
var run = childProcess.spawn(command, [], options)
run.stdout.pipe(process.stdout)
run.stderr.pipe(process.stderr)
run.on('close', function(code) {
  process.exit(code)
})
