const express = require("express");
const axios = require("axios");
const { validateUsername, validatePassword } = require("../utils/validate");
const { generateToken, auth } = require("../utils/authentication");

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.post("/user/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    validateUsername(username);
    validatePassword(password);

    // await setData(username, password);
    const response = await axios({
      url: "http://localhost:3004/set",
      method: "POST",
      data: { username, password },
      validateStatus: () => true,
    });

    res.status(response.status).send(response.data);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  const response = await axios({
    url: "http://localhost:3004/get",
    method: "POST",
    data: { username, password },
    validateStatus: () => true,
  });

  if (response.status === 200) {
    const token = generateToken(response.data.userId);

    return res.send({ token });
  }

  res.status(response.status).send(response.data);
});

app.get("/auth", async (req, res) => {
  if (!req.query.token)
    return res.status(401).send({ error: "Please authenticate." });

  const token = req.query.token.replace("Bearer ", "");
  const userId = auth(token);

  if (userId) {
    const response = await axios({
      url: `http://localhost:3004/check?userId=${userId}`,
      method: "GET",
      validateStatus: () => true,
    });

    if (response.status === 200) res.send({ userId });
    else res.status(401).send({ error: "Please authenticate." });
  } else res.status(401).send({ error: "Please authenticate." });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
