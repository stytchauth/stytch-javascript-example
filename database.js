const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            stytch_id text,

            CONSTRAINT email_unique UNIQUE (email)
            )`,
      (err) => {
        if(err) {
          console.error('Unable to initialize database schema', err);
        }
      }
    );
  }
});

/**
 * @typedef {Object} User
 * @property {Number} id
 * @property {String} name
 * @property {String} email
 * @property {String} stytch_id
 */

/**
 * Finds a user by their external stytch ID and their email
 * @param {String} stytchUserId
 * @param {String} email
 * @async
 * @returns {Promise<User|undefined>}
 */
function findUserByIdAndEmail(stytchUserId, email) {
  const query = `SELECT * FROM user WHERE stytch_id = ? AND email = ?`;
  const params = [stytchUserId, email];
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows[0]);
    })
  })
}

/**
 * Finds a user by their external stytch ID
 * @param {String} stytchUserId
 */
function findUserById(stytchUserId) {
  const query = `SELECT * FROM user WHERE stytch_id = ?`;
  const params = [stytchUserId];
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows[0]);
    })
  })
}

/**
 * Creates a new user entry with the provided userId and email
 * @param {String} stytchUserId
 * @param {String} email
 * @async
 * @returns {Promise<void>} Promise indicating work is complete
 */
function insertUser(stytchUserId, email) {
  const insertQuery = `INSERT INTO user (email, stytch_id) VALUES (?, ?)`;
  const params = [email, stytchUserId];

  return new Promise((resolve, reject) => {
    db.run(insertQuery, params, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  });
}

module.exports = {
  findUserByIdAndEmail,
  findUserById,
  insertUser,
}
