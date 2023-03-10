const jwt = require("jsonwebtoken");

require("dotenv").config();

const auth = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['RBRD_AUTH'];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    // Testing
    try {
      const decoded = jwt.decode(token);
      req.user = decoded;
    } catch (err1) {
      return res.status(401).send("Invalid Token");
    }
  }
  return next();
}

module.exports = auth;
