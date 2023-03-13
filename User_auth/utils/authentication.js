const jwt = require("jsonwebtoken");

const auth = (token) => {
  if (token && jwt.verify(token, "SECRETKEY")) {
    const { userId } = jwt.decode(token, { jwtPayload: true });

    return userId;
  }

  return undefined;
};

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, "SECRETKEY");

  return token;
};

module.exports = {
  auth,
  generateToken,
};
