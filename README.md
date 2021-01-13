# stytchjs-html-express
An example app using the Stytch Javascript SDK with HTML and Express.js

# Running the app
1. Make sure you have node installed: `brew install node`
1. Install dependencies: `npm install`
1. Add your Stytch API credentials from the API keys tab in your Stytch dashboard. You'll need to update `STYTCH_PROJECT_ID` and `STYTCH_SECRET` in your `.env` file with your project ID and secret from the dashboard.
1. From the API keys tab, create a public token and use it for `STYTCH_PUBLIC_TOKEN` in `signupOrLogin.html`.
1. This app uses [express-session](https://github.com/expressjs/session#readme) to create a session when the user logs in. Update `SESSION_SECRET` in the `.env` file with a secure string.
1. Run the app: `npm start`
1. Open the app in your browser at `localhost:9000`
