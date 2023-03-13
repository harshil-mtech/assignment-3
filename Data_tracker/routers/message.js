const express = require("express");
const axios = require("axios");
const messageModel = require("../models/message");

const router = new express.Router();

// Message Creation endpoint
router.post("/message", async (req, res) => {
  const token = req.headers.authorization;

  const authRes = await axios({
    url: `http://localhost:3001/auth?token=${token}`,
    method: "GET",
    validateStatus: () => true,
  });

  if (authRes.status === 200) {
    req.body.userId = authRes.data.userId;
    const message = new messageModel(req.body);

    try {
      const createdMsg = await message.save();

      res.status(201).send(createdMsg);
    } catch (e) {
      res.status(400).send(e.message);
    }
  } else res.status(authRes.status).send(authRes.data);
});

// Message Fetching endpoint
// GET /message?text=text
// GET /message?category=Direct&sortBy=date:asc
router.get("/message", async (req, res) => {
  const match = {};

  if (req.query.category) match.category = req.query.category;

  const sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }
  console.log(sort);

  let messages = await messageModel.find(match, null, { sort });
  console.log(messages);

  if (req.query.text) {
    const text = req.query.text;

    messages = messages.filter((message) => message.body.includes(text));
  }

  if (messages.length === 0) {
    res.status(404).send();
  } else {
    res.send(messages);
  }
});

module.exports = router;
