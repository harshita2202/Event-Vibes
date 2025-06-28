//A simple helper function that creates a JWT token for a logged-in user.

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

module.exports = generateToken;
