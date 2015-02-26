var childProcess = require("child_process")
var path = require("path")

var env = process.env
env.NODE_ENV = "test"

var options = {
	env:   env,
	stdio: "inherit",
}

var command = path.join(".", "node_modules", ".bin", "mocha")
if (process.platform == "win32") command += ".cmd"
try {
	childProcess.spawn(command, options)
} catch (ex) {}
