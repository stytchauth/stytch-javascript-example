import { stytch } from "./app.js";

// Clicking the logout button will revoke the session which causes the session onChange handler to trigger in app.js.
document.getElementById("logout-btn").onclick = function () {
  stytch.session.revoke();
};

// We can get the User and Session objects using getSync().
let user = stytch.user.getSync();
document.getElementById("user-obj").textContent = JSON.stringify(user, null, 2);

let session = stytch.session.getSync();
document.getElementById("session-obj").textContent = JSON.stringify(
  session,
  null,
  2
);
