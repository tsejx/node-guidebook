const process = require("process");

process.on("message", (msg) => {
  console.log("CHILD got message:", msg)
  process.exit(0)
});

process.send({ foo: "bar", baz: NaN });