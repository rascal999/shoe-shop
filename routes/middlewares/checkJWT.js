const jwt = require("jsonwebtoken");

require("dotenv").config();

/* Check for JWT presence */
const checkJWT = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['RBRD_AUTH'];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    // DEBUG
    try {
      const decoded = jwt.decode(token);
      req.user = decoded;
    } catch (err1) {
      // Do nothing
    }
  }

  next();
}

module.exports = checkJWT;
