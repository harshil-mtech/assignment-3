const express = require("express");
const axios = require("axios");

const app = express();

const port = process.env.PORT || 3003;

app.use(express.json());

app.post("/validate", async (req, res) => {
  const { userId, message, count } = req.body;
  let { random } = req.body;
  let category;

  const secondChance = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.round(Math.random() * 60 + 1);
        if (random % 10 === 0) reject(random);
        resolve(random);
      }, 4000);
    });
  };

  if (random % 10 === 0) {
    try {
      random = await secondChance();
      category = "Retired";
    } catch (data) {
      random = data;
      category = "Failed";
    }
  } else {
    category = "Direct";
  }

  res.send({ category, random });
});

app.listen(port, () => {
  console.log("Data Validator service is up on", port);
});
