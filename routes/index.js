require("dotenv").config(); // Get environment variables from .env file(s)

const cookieParser = require('cookie-parser');
const express = require('express'); // Using the express framework
const app = express();
const DBSOURCE = "usersdb.sqlite";

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require("./database.js")

const auth = require("./middlewares/auth");
const checkJWT = require("./middlewares/checkJWT");

app.use(express.static('public'))
app.use(cookieParser());

// Populate req.user if applicable
app.use(checkJWT);

/* Challenge write-up */
app.get('/report', (req, res) => {
  res.render('report', {
    user: req.user
  });
});

/* LOGIN / LOGOUT / BILLING */
app.get('/index', (req, res) => {
  res.render('index', {
    user: req.user
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    user: req.user,
    message: { },
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie('RBRD_AUTH');
  res.render('index', {
    message: { },
  });
});

/* BILLING */
/* REMOVE after refactor */
app.get('/api/v1/cards', auth, (req, res) => {
  /* Fetch cards */
  let card = [];

  var sql = "SELECT * FROM Cards WHERE Username = ?";
  db.all(sql, req.user['username'], function(err, rows) {
    if (err){
      //res.status(400).json({"error": err.message})
      //return;
    }

    rows.forEach(function (row) {
      card.push(row);
    })

    res.json({
        "message":"success",
        "data":rows
    })
  });
});

app.get('/api/v2/cards', auth, (req, res) => {
  /* Fetch cards */
  let card = [];

  var sql = "SELECT PAN,Expiry FROM Cards WHERE Username = ?";
  db.all(sql, req.user['username'], function(err, rows) {
    if (err){
      //res.status(400).json({"error": err.message})
      //return;
    }

    rows.forEach(function (row) {
      pan_mask = row['PAN'].substring(12);
      row['PAN'] = "************" + pan_mask;
      card.push(row);
    })

    res.json({
        "message":"success",
        "data":rows
    })
  });
});

app.get('/billing', auth, (req, res) => {
  /* Display */
  res.render('billing', {
    user: req.user,
    message: { },
  });
});

/* API/USERS */
app.get("/api/users", auth, function(req, res, next) {
  var sql = "SELECT * FROM Users"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  });
});

app.get("/api/user/:id", auth, function(req, res, next) {
  var sql = "SELECT * FROM Users WHERE id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":row
    })
  });
});

app.get("/api/login", (req, res) => {
  res.render('login', {
    user: req.user,
    message: { },
  });
});

app.post("/api/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
      // Email and Password in request?
      if (!(Email && Password)) {
        return res.status(400).render('login', {
          message: { error: "All input is required" },
        });
      }

      let user = [];

      var sql = "SELECT * FROM Users WHERE Email = ?";
      db.all(sql, Email, function(err, rows) {
        if (err){
          res.status(400).json({"error": err.message})
          return;
        }

        rows.forEach(function (row) {
          user.push(row);
        })

        try {
          var PHash = bcrypt.hashSync(Password, user[0].Salt);
        } catch(err) {
          return res.status(401).render('login', {
            message: { error: "Invalid credentials" },
          });
        }

        if(PHash === user[0].Password) {
          // * CREATE JWT TOKEN
          const token = jwt.sign(
            { user_id: user[0].Id, username: user[0].Username, Email },
              process.env.TOKEN_KEY,
            {
              expiresIn: "1h",
            }
          );

          user[0].Token = token;
          res.cookie('RBRD_AUTH',token);

        } else {
          return res.status(401).render('login', {
            message: { error: "Invalid credentials" },
          });
        }

        return res.redirect('/index');
      });
    } catch (err) {
      console.log(err);
    }
});

/* CARD */
app.post("/api/card/add", async (req, res) => {
  try {
    const { CardNumber, Expiry, CVV } = req.body;
      // Email and Password in request?
      if (!(CardNumber && Expiry && CVV)) {
        return res.status(400).render('billing', {
          message: { error: "All input is required" },
        });
      }

      let user = [];

      var sql = "INSERT INTO Cards (Username, PAN, Expiry, CVV, DateCreated) VALUES (?,?,?,?,?)";
      db.run(sql, req.user['username'], CardNumber, Expiry, CVV, Date('now'), function(err, rows) {
        if (err){
          res.status(400).json({"error": err.message})
          return;
        }

        return res.redirect('/billing');
      });
    } catch (err) {
      console.log(err);
    }
});

app.get("/api/cards", auth, function(req, res, next) {
  let card = [];

  var sql = "SELECT * FROM Cards WHERE Username = ?";
  db.all(sql, req.user['username'], function(err, rows) {
    if (err){
      res.status(400).json({"error": err.message})
      return;
    }

    rows.forEach(function (row) {
      card.push(row);
    })

    res.json({
        "message":"success",
        "data":rows
    })
  });
});

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', {
    user: req.user
  });
});

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;
