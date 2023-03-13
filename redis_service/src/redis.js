const redis = require("redis");
const uuid = require("uuid");

const config = async () => {
  const client = redis.createClient();

  await client.connect();

  client.on("error", (err) => {
    console.log(err);
  });

  return client;
};

const setData = async (username, password) => {
  const client = config();

  const userId = uuid.v4();
  const count = 0;

  if (await (await client).get(JSON.stringify({ username, password }))) {
    throw new Error("Username is already taken!");
  }

  // Storing key-val pair in redis
  await (await client).set(JSON.stringify({ username, password }), userId);

  // Storing hash having key message-app, field userId and object of user
  (await client).hSet(
    "message-app",
    userId,
    JSON.stringify({ username, password, count })
  );
};

const getUserId = async (username, password) => {
  const client = config();

  // Check if user exists or not
  const userId = await (
    await client
  ).get(JSON.stringify({ username, password }));

  return userId;
};

const exists = async (userId) => {
  const client = config();

  return typeof (await (await client).hGet("message-app", userId)) === "string";
};

const incrementCount = async (userId) => {
  const client = config();

  const user = JSON.parse(await (await client).hGet("message-app", userId));

  // Increment count
  user.count++;

  await (await client).hSet("message-app", userId, JSON.stringify(user));

  return user.count;
};

module.exports = {
  setData,
  getUserId,
  incrementCount,
  exists,
};
