const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportConfig = require("../../passportConfig.js")
// const jwt = require("jsonwebtoken");
const pool = require("../../db.js"); //
const queries = require("../users/queries.js");
const jsonParser = require("body-parser").json();


//Register
//3rd party auth takes this route too? async function register(req, res) {
    async function register(req, res) {
        try {
            const { email, password, username, name } = req.body;
            console.log(`auth/controller.js - register: ${email}, ${password}, ${username}, ${name}`);
    
            // Check if email exists
            console.log(`auth/controller.js - register - checking if user exists with the email:`, email);
            const emailExistsResult = await pool.query(queries.checkEmailExists, [email]);
            if (emailExistsResult.rows.length > 0) {
                console.log("This email address is already in use.");
                return res.status(400).send("This email address is already in use.");
            }
    
            // Hash password
            console.log(`auth/controller.js - register - hashing password!`);
            const hashedPassword = await hashPassword(password);
            console.log(`auth/controller.js - register - hashedPassword: `, hashedPassword);
    
            // Add user
            console.log(`auth/controller.js - register - adding User: ${username}, ${email}, ${hashedPassword}, ${name}`);
            await pool.query(queries.addUser, [username, email, hashedPassword, name]);
    
            // Login
            try {
                console.log(`auth/controller.js - Getting User information`);
                const result1 = await pool.query(queries.getUserByEmail, [email]);
                console.log(result1);
    
                if (result1.rowCount > 0) {
                    const userData = result1.rows[0]; // Get the first row from the result
                    console.log(`auth/controller.js - got userData: `, userData);
    
                    const userId = userData.user_id;
                    const userEmail = userData.email;
                    const userName = userData.username;
                    const name = userData.name;
                    const createdAt = userData.created_at;
                    const updatedAt = userData.updated_at;
    
                    console.log(`auth/controller.js - user ID: `, userId);
                    console.log(`auth/controller.js - user email: `, userEmail);
                    console.log(`auth/controller.js - username: `, userName);
                    console.log(`auth/controller.js - name: `, name);
    
                    console.log(`auth/controller.js - attempting login with email: `, email);
                    const authData = {
                        id: userId,
                        email: userEmail,
                        auth_method: "local",
                    };
    
                    req.login(authData, function (err) {
                        if (err) {
                            console.log(`auth/controller.js - Login failed: `, err);
                            return res.status(500).send("Login failed");
                        }
                        return res.status(201).json(userData);
                    });
                } else {
                    console.log(`No user found with email: ${email}`);
                    return res.status(404).send("User not found");
                }
            } catch (err) {
                console.log(`auth/controller.js - Login failed, returning new user data:`, err);
                return res.status(500).send("Login failed");
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send("Registration failed. Please ensure you are providing the required data.");
        }
    }
/*//////////////////////////////////////////*/


/* Login */
async function login(req, res) {
    try {
        // console.log('req:', req);
        console.log('req.body:', req.body);
        // Check if req.user is populated correctly
        console.log('req.user:', req.user);
        const { email, password } = req.body;
        const userData = await getUserByEmail(email);
        if (!userData) {
            console.log(`No user found with email: ${email}`);
            return res.status(404).send("User not found");
        }
        const { user_id, email: userEmail, username, name, created_at, updated_at } = userData;
        console.log(`auth/controller.js - User data retrieved:`, userData);

        // Ensure req.user is defined and has necessary properties
        if (!req.user || !req.user.email_address || !req.user.auth_method) {
            console.error('User object is invalid or missing properties. user/email/auth_method');
            return res.status(401).send('Invalid user data after login.');
        }

        // Respond with user information
        return res.status(200).json({
            id: userData.user_id, //Need to get this info 
            email_address: req.user.email_address,
            auth_method: req.user.auth_method,
            username: userData.username,
            name: userData.name
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Login failed");
    }
}


//Logout
async function logout(req, res) {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).send('Sorry, logout failed.');
      }
      return res.status(200).send('Logout successful.');
    });
  } else {
    return res.status(200).send('Already logged out.');
  }
}



/*///// Middleware ////*/
const requireLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send("You must be logged in to access this endpoint.");
  }
  next();
};

/*//////////////////////////////////////////*/

/*///// Utility Functions /////*/
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function getUserByEmail(email) {
    try {
        const query = 'SELECT * FROM users WHERE email = $1'; // Adjust query based on your database schema
        const result = await pool.query(query, [email]);

        if (result.rowCount > 0) {
            const userData = result.rows[0]; // Get the first row from the result
            console.log('User data:', userData); // Optional: Log user data for debugging
            
            // Extract specific fields if needed
            const { user_id, email, username, name, created_at, updated_at } = userData;

            // Return the user data object
            return {
                user_id,
                email,
                username,
                name,
                created_at,
                updated_at
            };
        } else {
            console.log(`No user found with email: ${email}`);
            return null; // Return null if no user found
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error; // Propagate error to caller
    }
}


/*//////////////////////////////////////////*/

/*
// ==== Local Login ====

// https://www.passportjs.org/concepts/authentication/password/
// https://www.passportjs.org/tutorials/password/
// https://www.passportjs.org/howtos/password/
// https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5



async function localVerify(username, password, done) {
  const email_address = username;
  try {
    const user = await db.getUserByEmail(email_address, 'local');
    if (!user) {
      return done(null, false,
        { message: `An account with the email address '${email_address}' does not exist.` }
      );
    }
    const matchedPassword = await bcrypt.compare(password, user.hashed_pw);
    if (!matchedPassword) {
      return done(null, false, { message: 'Incorrect email address or password.' });
    }
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: user.auth_method
    });

  } catch(err) {
    return done(err);
  }
}


// ==== Google Login ====
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/redirect',
  scope: ['email']
}

async function googleVerify(issuer, profile, done) {
  const email_address = profile.emails[0].value;
  try {
    let user = await db.getUserByEmail(email_address, 'google');
    if (!user) {
      user = await db.addGoogleUser(email_address);
    }
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: 'google'
    });
  } catch(err) {
    return done(null, null);
  }
}


// ==== Serialization and Deserialization ====
function serialize(user, done) {
  process.nextTick(function() {
    return done(null, {
      id: user.id,
      email_address: user.email_address,
      auth_method: user.auth_method
    });
  });
}
function deserialize(user, done) {
  process.nextTick(function() {
    return done(null, user);
  });
}
*/

module.exports = {
  //   googleConfig,
  //   googleVerify,
  register,
  login,
  logout,
  requireLogin,
  hashPassword,
  getUserByEmail,
};
