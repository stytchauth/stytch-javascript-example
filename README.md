# Stytch HTML and Express.js example application

## Overview

This example application demonstrates how one may use Stytch within a HTML and simple Express application.

This project uses Stytch's [Vanilla SDK](https://www.npmjs.com/package/@stytch/vanilla-js) and [Node JavaScript SDK](https://www.npmjs.com/package/stytch).

This application features Email Magic Links. You can use this application's source code as a learning resource, or use it as a jumping off point for your own project. We are excited to see what you build with Stytch!

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Once your account is set up a Project called "My first project" will be automatically created for you.

2. Within your new Project, navigate to [SDK configuration](https://stytch.com/dashboard/sdk-configuration), and make the following changes:

   - Click **Enable SDK**.
   - Under **Authorized environments** add the domain `http://localhost:9000`.
   - Within the **Email Magic Links** drawer, toggle on **Enable the LoginOrCreate Flow**.
     
3. Navigate to [Redirect URLs](https://stytch.com/dashboard/redirect-urls), and add `http://localhost:9000/authenticate` as the types **Login** and **Sign-up**.
   
4. Finally, navigate to [API Keys](https://stytch.com/dashboard/api-keys), you will need values from this page later on.

### On your machine

Make sure you have Node installed. Please refer to [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/) how to do this.

In your terminal clone the project and install dependencies:

```bash
git clone https://github.com/stytchauth/stytchjs-html-express.git
cd stytchjs-html-express
npm i
```

Next, copy the template `.env.template` as `.env `.

```bash
cp .env_template .env
```

From the Stytch Dashboard [API Keys](https://stytch.com/dashboard/api-keys) copy the values into the `.env` file (project id and secret). 

The value for `SESSION_SECRET` needs to be be randomly generated. This can be done for example by running `openssl rand -hex 24` and copying in the value. Or, if using just for local testing, feel free to leave as it is.

Fill in the placeholder value for `STYTCH_PUBLIC_TOKEN` in `public/signupOrLogin.html`. This can also be found on your Stytch Dashboard [API Keys](https://stytch.com/dashboard/api-keys).

## Running locally

After completing all the set up steps above the application can be run with the command:

```bash
npm start
```

The application will be available at [`http://localhost:9000`](http://localhost:9000).

You'll be able to login with Email Magic Links or Google OAuth and see your Stytch User object, Stytch Session, and see how logging out works.

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our ​[Slack community](https://join.slack.com/t/stytch/shared_invite/zt-nil4wo92-jApJ9Cl32cJbEd9esKkvyg)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).