const express = require("express");
const { setData, getUserId, incrementCount, exists } = require("./redis");

const app = express();

const port = process.env.PORT || 3004;

app.use(express.json());

app.post("/set", async (req, res) => {
  try {
    const { username, password } = req.body;

    await setData(username, password);
    res.status(201).send();
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post("/get", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userId = await getUserId(username, password);
    res.status(200).send({ userId });
  } catch (error) {
    res.status(400).send({ error });
  }
});

app.get("/check", async (req, res) => {
  try {
    const { userId } = req.query;

    if (await exists(userId)) return res.status(200).send();

    return res.status(404).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.get("/increment", async (req, res) => {
  try {
    const { userId } = req.query;

    const count = await incrementCount(userId);

    return res.status(200).send({ count });
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log("Redis service is up on port", port);
});
