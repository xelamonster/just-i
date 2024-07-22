if (process.cwd() === process.env.INIT_CWD) {
  console.log("Skipped postinstall (just-i)")
  process.exit()
}

import decompress from "decompress"
import { uname } from "node-uname"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import latest from "./data/latest.json" with { type: "json" }

const installUnix = async () => {
  console.log(">>> Just installing just <<<")
  const { sysname, machine } = uname()
  const u = `${machine}-${sysname}`
  const installer = latest.installers.find((i) => i.unames.includes(u))
  if (!installer) throw new Error("Unable to find installer for platform %s", u)
  console.log("Installing just %s for %s", installer.name, u)
  console.log("Downloading %s (%s)...", installer.name, installer.url)
  const params = { headers: { Accept: "application/octet-stream" } }
  const res = await fetch(installer.url, params)
  if (res.status !== 200) throw new Error("Unable to fetch installer: %s", res.statusText)
  const data = await res.arrayBuffer()
  const out = join(process.cwd(), "bin")
  const bin = "just"
  console.log("Extracting %s to %s...", bin, out)
  await mkdir(out).catch(_ => null)
  await decompress(Buffer.from(data), out, { filter: f => f.path === bin })
  console.log("<<< Done! >>>")
}

const installWindows = async () => {
  console.log("Windows not supported")
  process.exit(1)
}

if (process.platform === "win32") {
  installWindows()
} else {
  installUnix()
}
