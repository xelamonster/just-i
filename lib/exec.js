const { spawnSync } = require("node:child_process")
const { join } = require("node:path")
const args = process.argv.slice(2)
const cwd = process.cwd()
const win = process.platform === "win32"
const just = win ? "just.exe" : "just"
const bin = join(__dirname, "bin")
const cmd = join(bin, just)
// allows nested `just` calls to work sans-wrapper
process.env.PATH = [bin, process.env.PATH].join(win ? ";" : ":")
spawnSync(cmd, args, { cwd, stdio: "inherit" })
