const express = require("express");
const axios = require("axios");

const app = express();

const port = process.env.PORT || 3002;

app.use(express.json());

app.post("/message", async (req, res) => {
  let { data, status } = await axios({
    url: `http://localhost:3001/auth?token=${req.headers.authorization}`,
    method: "get",
    validateStatus: () => true,
  });

  if (status !== 200) return res.status(status).send(data);

  const { message } = req.body;
  const { userId } = data;
  let random = Math.round(Math.random() * 59 + 1);

  // increment the request count
  const incrementRes = await axios({
    url: `http://localhost:3004/increment?userId=${userId}`,
    method: "get",
    validateStatus: () => true,
  });

  if (incrementRes.status !== 200)
    return res.status(500).send({ error: "Something went wrong." });

  const { count } = incrementRes.data;

  // Passing the data to data validator
  const validatorRes = await axios({
    url: "http://localhost:3003/validate",
    method: "post",
    data: {
      userId,
      message,
      random,
      count,
    },
    validateStatus: () => true,
  });

  random = validatorRes.data.random;
  const category = validatorRes.data.category;

  const trackerRes = await axios({
    url: "http://localhost:3000/message",
    method: "post",
    headers: {
      authorization: req.headers.authorization,
    },
    data: {
      body: message,
      category,
    },
    validateStatus: () => true,
  });

  res.status(trackerRes.status).send(trackerRes.data);
});

app.listen(port, () => {
  console.log("Server is up on port", port);
});
