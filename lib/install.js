const decompress = require("decompress")
const { uname } = require("node-uname")
const { mkdir } = require("node:fs/promises")
const { join } = require("node:path")
const latest = require("./data/latest.json")

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
  const out = join(__dirname, "bin")
  const bin = "just"
  console.log("Extracting %s to %s...", bin, out)
  await mkdir(out).catch(_ => null)
  await decompress(Buffer.from(data), out, { filter: f => f.path === bin })
  console.log("<<< Done! >>>")
}

const installWindows = async () => {
  // TODO this (probably refactor a lot of common logic from installUnix to install)
  console.log("Windows not supported")
  process.exit(1)
}

module.exports.install = async () => {
  if (process.platform === "win32") {
    await installWindows()
  } else {
    await installUnix()
  }
}
