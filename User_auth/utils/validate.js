const validateUsername = (username) => {
  if (username.length >= 6 && username.length <= 12) {
    const pattern = /^[a-zA-Z0-9]*$/;

    if (pattern.test(username)) {
      return true;
    } else {
      throw new Error("username characters should be alphanumeric");
    }
  } else {
    throw new Error(
      "username length should be between 6 to 12 characters long."
    );
  }
};

const validatePassword = (password) => {
  if (password.length >= 6 && password.length <= 12) {
    return true;
  } else {
    throw new Error(
      "password length should be between 6 to 12 characters long."
    );
  }
};

module.exports = {
  validatePassword,
  validateUsername,
};
