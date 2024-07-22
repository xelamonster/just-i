const { spawn } = require("node:child_process")
const { join, basename } = require("node:path")
const debug = (...args) => process.env.JUST_I_DEBUG && console.debug(...args) 

const run = (first = false) => {
  const proc = spawn(cmd, args, opts)
  if (first) proc.on("error", (err) => {
    debug("(just-i) caught %j", err)
    const isJustMissing = err.code === "ENOENT" && basename(err.path) === just
    if (!isJustMissing) throw err
    console.log("(just-i) Missing just binary! Installing...")
    require("./install").install().then(run)
  })
  process.env.JUST_I_DEBUG && proc.on("close", () => console.debug("(just-i) just closed"))
  debug("(just-i) just spawned")
}

const args = process.argv.slice(2)
debug("(just-i) exec called with args: %s", args.join(","))
const win = process.platform === "win32"
const just = win ? "just.exe" : "just"
const bin = join(__dirname, "bin")
const cmd = join(bin, just)
debug("(just-i) spawning just: %s %s", cmd, args.join(" "))
const opts = { cwd: process.cwd(), stdio: "inherit" }
// allows nested `just` calls to work sans-wrapper
process.env.PATH = [bin, process.env.PATH].join(win ? ";" : ":")
run(true)
