const cp = require("child_process");

const forked = cp.fork(`${__dirname}/child.js`);

forked.on("message", (msg) => {
  console.log("PARENT got message:", msg);
})

forked.send({ hello: "world" })