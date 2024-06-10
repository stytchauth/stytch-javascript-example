import { stytch } from './app.js';

// Look for the Stytch token in query params.
const queryParams = new URLSearchParams(window.location.search);
const token = queryParams.get('token');
const tokenType = queryParams.get('stytch_token_type');

// If a token is found, authenticate it with the appropriate method.
if (token && tokenType) {
  if (tokenType === 'magic_links') {
    stytch.magicLinks
      .authenticate(token, {
        session_duration_minutes: 60,
      })
      .then(() => console.log('Successful authentication: Email magic link'))
      .catch((err) => {
        console.error(err);
        alert(
          'Email Magic Link authentication failed. See console for details.'
        );
      });
  }
} else {
  // If query params are not found, announce that something went wrong.
  alert('Something went wrong. No token found to authenticate.');
}
