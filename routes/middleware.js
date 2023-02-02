const jwt = require("jsonwebtoken");

require("dotenv").config();

const middleware = {
  verifyToken: function(req, res, next) {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['RBRD_AUTH'];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  },

  /* Check for JWT presence */
  checkToken: function(req, res, next) {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['RBRD_AUTH'];

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
      //console.log(req.user);
    } catch (err) {
      // Do nothing
    }
    return next();
  },

  getCards: function(req, res, next) {
    let card = [];

    var sql = "select * from Cards WHERE Username = ?";
    db.all(sql, req.user['username'], function(err, rows) {
      if (err){
        //res.status(400).json({"error": err.message})
        //return;
      }

      rows.forEach(function (row) {
        card.push(row);
      })

      req.cards = res.json({
          "message":"success",
          "data":rows
      })
    });

    return next();
  },
}
