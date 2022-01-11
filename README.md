# stytchjs-html-express

An example app using the Stytch JavaScript SDK with HTML and Express.js

# Running the app

1. Make sure you have [node](https://nodejs.org/en/) installed. `brew install node` works fine!
2. Install dependencies: `npm install`
3. Create your own .env file by running `cp .env_template .env`
4. Fill in the placeholder values for `STYTCH_PROJECT_ID`, `STYTCH_SECRET`, and `STYTCH_PUBLIC_TOKEN` in your `.env` file. Get your Stytch API credentials from the API keys tab in your [Stytch dashboard](https://stytch.com/dashboard/api-keys).
6. Add http://localhost:3000/authenticate as a valid sign-up and login URL on your [Stytch dashboard](https://stytch.com/dashboard/magic-link-urls)
7. This app uses [express-session](https://github.com/expressjs/session#secret) to create a session when the user logs in. Update `SESSION_SECRET` in the `.env` file with a long random string (for example, the output of `openssl rand -hex 24`).
8. Run the app: `npm start`
9. Open the app in your browser at `localhost:3000`
