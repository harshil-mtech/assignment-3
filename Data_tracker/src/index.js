const express = require("express");
require("../db/db");
const messageRouter = require("../routers/message");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(messageRouter);

app.listen(port, () => {
  console.log("Server is up on", port);
});
