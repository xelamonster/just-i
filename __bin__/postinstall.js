// stop running the damn postinstall hook every time I try to update my deps here
if (process.cwd() === process.env.INIT_CWD) {
  console.log("Skipped postinstall (just-i)")
  process.exit()
}

require("../dist/install").install()