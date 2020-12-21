const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const bodyParser = require('body-parser');

// TODO: use environment variables for these and store them somewhere safe
const STYTCH_PROJECT_ID = 'project-live-11111111-1111-1111-1111-111111111111';
const STYTCH_SECRET = 'secret-live-11111111111111111111111111111111';
const SESSION_SECRET = 'CREATE_A_SESSION_SECRET';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
	secret: SESSION_SECRET,
	cookie: { maxAge: 60000 },
	resave: true,
	saveUninitialized: false
}));

app.use(bodyParser.json())

app.get('/', function (req, res) {
	if(req.session.authenticated) {
		res.redirect('/home');
		return;
	}
  res.sendFile(path.join(__dirname, 'public', 'signupOrLogin.html'));
});

app.get('/home', function (req, res) {
	if(!req.session.authenticated) {
		res.redirect('/');
		return;
	}

  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.post('/users', function (req, res) {
	var stytchUserId = req.body.userId;
	// TODO: Save stytchUserId with your user record in your app's storage
	res.send(`Created user with stytchUserId: ${stytchUserId}`);
});

app.get('/authenticate', function (req, res) {
	var token = req.query.token;
	axios.post(`https://api.stytch.com/v1/magic_links/${token}/authenticate`, {}, {
		headers: {
			Authorization: 'Basic ' + Buffer.from(`${STYTCH_PROJECT_ID}:${STYTCH_SECRET}`).toString('base64')
    },
	})
	.then(response => {
		req.session.authenticated = true;
		req.session.save(function(err) {
			if(err) console.log(err);
		});
		res.redirect('/home')
	})
	.catch(error => {
		console.log(error);
		res.send('There was an error authenticating the user.');
	});
});

app.listen(9000);