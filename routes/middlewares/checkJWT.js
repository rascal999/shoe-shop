const jwt = require("jsonwebtoken");

require("dotenv").config();

/* Check for JWT presence */
const checkJWT = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['RBRD_AUTH'];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    //console.log(req.user);
  } catch (err) {
    // Do nothing
  }
  next();
}

module.exports = checkJWT;
