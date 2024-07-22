// fixes pnpm workspaces (and avoids publishing binaries accidentally)
// https://github.com/pnpm/pnpm/issues/1801#issuecomment-972031132

// funny enough this turned out to be the opposite issue from install.js
// prepare also runs on "local" installs like file: or git:
// so without this condition their freshly downloaded `just` gets overwritten
if (process.cwd() !== process.env.INIT_CWD) {
  console.log("Skipped prepare (just-i)")
  process.exit()
}

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

const bin = join(process.cwd(), "dist", "bin")
const just = join(bin, process.platform === "win32" ? "just.exe" : "just")
await mkdir(bin).catch(_ => null)
await writeFile(just, "#!/usr/bin/env node")
console.log("Wrote stub: %s", just)