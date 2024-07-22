import { build } from "esbuild"

await build({
  entryPoints: ["lib/exec.js", "lib/install.js"],
  bundle: true,
  outdir: "dist",
  platform: "node",
  format: "cjs",
  target: "node12",
  minify: true,
  logLevel: "info",
  external: ["node-uname"],
})
