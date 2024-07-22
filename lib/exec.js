import { spawn } from "node:child_process"
import { join } from "node:path"
const args = process.argv.slice(2)
const win = process.platform === "win32"
const just = win ? "just.exe" : "just"
const cmd = join(__dirname, "bin", just)
const proc = spawn(cmd, args, { cwd: process.cwd(), stdio: "inherit", detached: !win })
proc.unref()
process.exit(0)
