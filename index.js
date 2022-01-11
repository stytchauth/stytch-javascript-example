const express = require("express");
const path = require("path");
const sprightly = require('sprightly');
const session = require("express-session");

const cookieParser = require('cookie-parser');
const stytch = require("stytch");

const {
  findUserByIdAndEmail,
  findUserById,
  insertUser,
} = require("./database.js");

require("dotenv").config();

const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET,
  env: stytch.envs.test,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.engine('html', sprightly);
app.set('views', './public');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 20 * 60 * 1000 /* Twenty minutes in milliseconds */},
    resave: true,
    saveUninitialized: false,
  })
);

/**
 * The regular homepage view.
 * The user can only access this if they are already authenticated and have an active session.
 * Otherwise, they are redirected to /signupOrLogin
 */
app.get("/",
  ensureAuthenticated,
  async function (req, res) {
    const {session} = req.session.stytch;
    const user = await findUserById(session.user_id);
    return res.render('home.html', {
      LOCAL_USER_ID: user.id,
      EMAIL: user.email,
      STYTCH_USER_ID: session.user_id,
      EXPIRES_IN: `${session.expires_at - Date.now()}ms`,
    });
  });

/**
 * The login view.
 * This view mounts the Stytch SDK for the user to log in with.
 */
app.get("/signupOrLogin",
  function (req, res) {
    return res.render('signupOrLogin.html', {
      STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN
    });
  });

app.get("/logout",
  destroySessionAndEnsureLoggedOut);

/**
 * The callback for Stytch's magic links.
 * After the user clicks the link in their email, they will be redirected here.
 * We must authenticate the token with Stytch before issuing a session.
 * After the session is issued, the user is logged in!
 */
app.get("/authenticate", async function (req, res, next) {
  const token = req.query.token;
  if (!token) {
    return res.redirect('/signupOrLogin');
  }
  try {
    req.session.stytch = await client.magicLinks.authenticate(token, {session_duration_minutes: 20});
    req.session.save(function (err) {
      if (err) return next(err);
      console.log('User has been authenticated and their information is stored in a session. Redirecting to homepage.')
      res.redirect("/");
    });
  } catch (err) {
    console.error('An error occurred authenticating the magic link token', err);
    return next(err);
  }
});

/**
 * This endpoint keeps track of user creation requests.
 * You may want to save your users before they complete the login flow.
 * Subscribe to the onEvent callback from the stytch frontend js client to learn when a user has sent a login email.
 */
app.post("/users", async function (req, res, next) {
  const stytchUserId = req.body.userId;
  const email = req.body.email;
  try {
    const {statusCode, user} = await upsertUser(stytchUserId, email);
    return res.status(statusCode).json(user);
  } catch (err) {
    console.error('Unable to upsert user', err);
    return next(err);
  }
});

app.listen(3000, () => {
  console.log('The application is listening on port 3000.');
  console.log('You can now view it in the browser: \033[1m\033[4mhttp://localhost:3000\033[0m');
});

async function upsertUser(stytchUserId, email) {
  const user = await findUserByIdAndEmail(stytchUserId, email);
  if (user) {
    console.log('User already exists locally!');
    return {user, statusCode: 200};
  }
  console.log('User does not exist, creating a new entry');
  const createdUser = await insertUser(stytchUserId, email);
  return {
    user: createdUser,
    statusCode: 201
  }
}

/**
 * This express middleware logs out the user - both destroying their local session and in Stytch.
 */
function destroySessionAndEnsureLoggedOut(req, res, next) {
  if (req.session.stytch) {
    // This request can happen in the background - we don't need to wait for a result before returning a response
    client.sessions.revoke({session_token: req.session.stytch.session_token})
      .then(() => console.log('[Background] Stytch session has been destroyed'))
      .catch(err => console.error('An error occurred revoking the session token', err));
  }

  return req.session.destroy(function (err) {
    if (err) return next(err);
    console.log(`User's local session has been destroyed. Redirecting them to login.`);
    return res.redirect('/signupOrLogin');
  });
}

/**
 * This express middleware checks to make sure the user has an active session.
 * This middleware makes a call to Stytch on every request.
 * You probably want to add a cache for performance. Better support for client-side caching is coming soon!
 * IMPORTANT! Stytch may return new session tokens over time. We MUST save the returned token values.
 */
async function ensureAuthenticated(req, res, next) {
  if (!req.session.stytch) {
    console.log('No session found! Redirecting to login.');
    return destroySessionAndEnsureLoggedOut(req, res, next);
  }
  try {
    req.session.stytch = await client.sessions.authenticate({
      session_token: req.session.stytch.session_token,
      session_duration_minutes: 20
    });
    console.log(`The user's session is still valid. Request is allowed.`);
    return next();
  } catch (err) {
    console.error(`An error occurred authenticating the user's session`, err);
    return next(err);
  }
}
