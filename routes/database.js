var sqlite3 = require('sqlite3').verbose()
var bcrypt = require('bcryptjs');

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  }
  else {
    var salt = bcrypt.genSaltSync(10);

    db.run(`CREATE TABLE Users (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Username text,
      Email text,
      Password text,
      Salt text,
      Token text,
      DateLoggedIn DATE,
      DateCreated DATE
      )`,
    (err) => {
      if (err) {
        // Table already created
      } else{
        // Table just created, creating some rows
        var insert = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
        db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
        db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
        db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
        db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
        db.run(insert, ["user5", "user5@example.com", bcrypt.hashSync("user5", salt), salt, Date('now')])
      }
    });

    db.run(`CREATE TABLE Cards (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Username text,
      PAN text,
      Expiry text,
      CVV text,
      DateCreated DATE
      )`,
    (err) => {
      if (err) {
        // Table already created
      } else{
        // Table just created, creating some rows
        var insert = 'INSERT INTO Cards (Username, PAN, Expiry, CVV, DateCreated) VALUES (?,?,?,?,?)'
        //db.run(insert, ["user1", "376100000000004", "12/25", "123", Date('now')])
        db.run(insert, ["user2", "341111597241002", "02/28", "456", Date('now')])
        db.run(insert, ["user3", "6333000023456788", "11/23", "778", Date('now')])
        db.run(insert, ["user4", "5413330089099049", "01/26", "610", Date('now')])
        db.run(insert, ["user5", "4111111111111111", "10/29", "381", Date('now')])
      }
    });
  }
});

module.exports = db;
