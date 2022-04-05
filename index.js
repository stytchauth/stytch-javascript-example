const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const stytch = require("stytch");
const database = require("./database.js");
const axios = require('axios');

require("dotenv").config();

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET,
  env: stytch.envs.test,
});

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

app.get("/crypto_wallets", function (req, res) {
  res.status(200).send("hi");
});

app.post("/crypto_wallets/authenticate/start", function (req, res) {
  axios.post('http://localhost:8080/v1/crypto_wallets/authenticate/start', {
      crypto_wallet_address: req.body.address,
      crypto_wallet_type: "solana",
    }, {
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: "project-develop-x",
      password: "secret-develop-x",
    }}).then(function (response) {
      return res.status(200).send(response.data)
    })
});

app.post("/crypto_wallets/authenticate", function (req, res) {
  axios.post('http://localhost:8080/v1/crypto_wallets/authenticate', {
    crypto_wallet_address: req.body.address,
    crypto_wallet_type: "solana",
    signature: req.body.signature,
    session_duration_minutes: 10,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: "project-develop-x",
      password: "secret-develop-x",
    }}).then(function (response) {
      return res.status(200).send(response.data)
  })
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
  const query = 'SELECT id, email FROM user WHERE stytch_id = ? AND email = ?';
  const params = [stytchUserId, email]
  database.db.all(query, params, (err, rows) => {
    if (err) return res.status(400).send(err);

    // If user is not found, create a new user with stytch_id and email
    if (rows.length === 0) {
      const insertQuery = 'INSERT INTO user (email, stytch_id) VALUES (?, ?)';
      const params = [email, stytchUserId];
      database.db.run(insertQuery, params, (result, err) => {
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
  client.magicLinks.authenticate(token)
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

app.listen(9000, () => {
  console.log('The application is listening on port 9000.');
  console.log('You can now view it in the browser: \033[1m\033[4mhttp://localhost:9000\033[0m');
});
