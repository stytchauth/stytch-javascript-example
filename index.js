const express = require("express");
const path = require("path");
const axios = require("axios");
const session = require("express-session");
const bodyParser = require("body-parser");
const database = require("./database.js");

require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());

app.get("/", function (req, res) {
  if (req.session.authenticated) {
    res.redirect("/home");
    return;
  }
  res.sendFile(path.join(__dirname, "public", "signupOrLogin.html"));
});

app.get("/home", function (req, res) {
  if (!req.session.authenticated) {
    res.redirect("/");
    return;
  }

  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.post("/users", async function (req, res) {
  const stytchUserId = req.body.userId;
  const email = req.body.email;

  // Query the user by stytch_id and email
  const query = `SELECT id, email FROM user WHERE stytch_id = "${stytchUserId}" AND email = "${email}"`;
  console.log(database.db);
  database.db.all(query, [], (err, rows) => {
    if (err) return res.status(400).send(err);

    // If user is not found, create a new user with stytch_id and email
    if (rows.length === 0) {
      const insertQuery = `INSERT into user (email, stytch_id) VALUES ("${email}", "${stytchUserId}")`;
      database.db.run(insertQuery, (result, err) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          console.log("User created");
          return res.status(201).send(result);
        }
      });
    } else {
      // User was already saved in database.
      console.log("User retrieved");
      res.status(200).send(rows[0]);
    }
  });
});
app.get("/authenticate", function (req, res) {
  var token = req.query.token;
  axios
    .post(
      `https://test.stytch.com/v1/magic_links/${token}/authenticate`,
      {},
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.STYTCH_PROJECT_ID}:${process.env.STYTCH_SECRET}`
            ).toString("base64"),
        },
      }
    )
    .then((response) => {
      req.session.authenticated = true;
      req.session.save(function (err) {
        if (err) console.log(err);
      });
      res.redirect("/home");
    })
    .catch((error) => {
      console.log(error);
      res.send("There was an error authenticating the user.");
    });
});

app.listen(9000);
