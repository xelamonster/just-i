import { Octokit } from "@octokit/rest"
import { writeFileSync } from "node:fs"
import { join } from "node:path"

const contentTypes = ["application/gzip", "application/zip"]
const targetPattern = /(?<=just-[\d.]+-)[^.]+/
const targetArch = new Map([
  ["aarch64-unknown-linux-musl", ["linux", "aarch64-Linux"]],
  ["aarch64-apple-darwin", ["darwin", "arm64-Darwin"]],
  ["arm-unknown-linux-musleabihf", ["linux", "armv6l-Linux"]],
  ["armv7-unknown-linux-musleabihf", ["linux", "armv7l-Linux"]],
  ["x86_64-apple-darwin", ["darwin", "x86_64-Darwin"]],
  ["x86_64-unknown-linux-musl", ["linux", "x86_64-Linux"]],
  ["x86_64-pc-windows-msvc", ["windows", ["x86_64-MINGW64_NT", "x86_64-Windows_NT"]]],
])

const parseTarget = (name) => {
  const [match] = name.match(targetPattern)
  if (!match) {
    console.warn("Unable to determine build target for %s", name)
    return null
  }
  const arch = targetArch.get(match)
  if (!arch) {
    console.warn("Unable to determine target arch for %s (%s)", name, match)
    return null
  }
  console.log("%s => platform %s unames %j", name, arch[0], arch[1])
  return { platform: arch[0], unames: typeof arch[1] === "string" ? [arch[1]] : arch[1] }
}

const parseAssets = (assets) => {
  return assets.map((asset) => {
    const { name, id, url, content_type: contentType } = asset
    return { name, id, url, contentType }
  }).filter((a) => contentTypes.includes(a.contentType)).map((a) => [parseTarget(a.name), a])
    .filter(([t, _a]) => t).map(([t, a]) => ({ ...t, ...a }))
}

const ok = new Octokit()
const res = await ok.repos.getLatestRelease({ owner: "casey", repo: "just" })
if (res.status !== 200) throw new Error("Unable to get latest release", res)
const { name, tag_name: tag, assets } = res.data
console.log("version %s tag %s", name, tag)
const installers = parseAssets(assets)
writeFileSync(
  join(process.cwd(), "lib", "data", "latest.json"),
  JSON.stringify({ name, tag, installers }, null, 2),
)
