const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db.js");
const queries = require("./src/users/queries.js");
const bcrypt = require("bcrypt");

// User serialization and deserialization -> Set and Get ID from session
function serialize(user, done) {
    console.log(`passportConfig.js - serialize user, user: ${user}`);
  console.log(`passportConfig.js - serialize user, user: ${JSON.stringify(user)}`);
    process.nextTick(function() {
      return done(null, {
        id: user.id,
        email_address: user.email_address,
        auth_method: user.auth_method,
        username: user.username,
        name: user.name,
      });
    });
  }
  
  //req.user is defined when you deserialize
  function deserialize(user, done) {
    console.log(`passportConfig.js - deserialize user, user: ${user}`);
    process.nextTick(function() {
      return done(null, user);
    });
  }


// Google strat
/*
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Using Google Passport Strategy");
      console.log("Google profile:", profile);

      // Here, you can process the profile data as needed
      // For example, you can check if the email is verified and proceed accordingly

      // If you need to store some data, you can save it in session or return it
      const userData = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        emailVerified: profile.emails[0].verified,
      };

      // Pass the user data to the callback
      return done(null, userData);
    }
  )
);
*/
// Facebook Strategy
/*
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
      profileFields: ["id", "displayName", "email", "picture.type(large)"], // Specify the fields you want to retrieve
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Using Facebook Passport Strategy");
      console.log("Facebook profile:", profile);

      // Here, you can process the profile data as needed
      // For example, you can check if the email is verified and proceed accordingly

      // If you need to store some data, you can save it in session or return it
      const userData = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        picture: profile.photos ? profile.photos[0].value : null,
      };

      // Pass the user data to the callback
      return done(null, userData);
    }
  )
);

// Parse user string function
function parseUser(userString) {
  if (!userString) return null; // userString is null or empty?
  const userData = userString.slice(1, -1).split(","); // Split userString into an array of fields ',' = delimiter
  return {
    id: userData[0], // index is field column
    username: userData[1],
    password: userData[2],
    email: userData[5], // 5th column in table is email etc
  };
}
*/


passport.use(new LocalStrategy({
    usernameField: 'email', 
    passwordField: 'password' // password field in form/request payload is 'password'
},
async function(email, password, done) {
    try {
        // Check if user exists with the provided email
        const userQuery = await pool.query(queries.getUserByEmail, [email]);
        if (userQuery.rows.length === 0) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }


        const user = userQuery.rows[0];
        console.log(`user id${user.user_id}`);
        console.log(`user hashed password ${user.hashed_password}`);
        console.log(`user id${JSON.stringify(user)}`);
        // Compare passwords
        const isMatch = await comparePasswords(password, user.hashed_password); // Implement this function to compare passwords

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Remove sensitive data from user object before passing it to 'done'
        const sanitizedUser = {
            id: user.user_id,
            email_address: user.email,
            auth_method: 'local',
            username: user.username, 
            name: user.name,
            // Add other necessary fields here for getStatus to receive
        };

        return done(null, sanitizedUser);
    } catch (err) {
        console.error("Error in local strategy:", err);
        return done(err);
    }
}));
  
async function comparePasswords(plainPassword, hashedPassword) {
    try {
        console.log(`plain ${plainPassword}, hashed ${hashedPassword}`);
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}


module.exports = {
    serialize,
    deserialize,
    passport,
  };

