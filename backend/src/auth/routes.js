const express = require("express");
const router = express.Router();
const controller = require("./controller");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const pool = require("../../db"); 
const { register, authenticateToken, login, logout} = require("./controller");
const passportConfig = require("../../passportConfig");
const passport = require('passport');
// const jwt = require("jsonwebtoken");

// router.post("/register", register);
router.post('/register', jsonParser, controller.register);

// router.post("/login", login); 
router.post('/login', passport.authenticate('local'), controller.login);



// router.post("/logout", logout);
router.post('/logout', controller.logout);

//status 
router.get('/status', (req, res) => {
    let jsonData;
    if (!req.isAuthenticated()) {
      jsonData = { logged_in: false, id: null, email_address: null, auth_method: null };
    } else {
      console.log(`auth/routes.js - req.user: `, req.user);
      jsonData = {
        logged_in: true,
        id: req.user.id,
        email_address: req.user.email_address,
        auth_method: req.user.auth_method,
        username: req.user.username,
        name: req.user.name
      };
    }
    res.status(200).json(jsonData);
  });

  
module.exports = router;
/*
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3001/login" }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, auth_method: 'google' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

        // Set the token in the cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    // Create the JSON data
    const jsonData = {
      logged_in: true,
      id: req.user.id,
      email_address: req.user.email,
      auth_method: 'google'
    };

    //res.json({ message: 'Login successful', jsonData }); //This sends you to backend with json!
        // Redirect to the client /account page with the token
    res.redirect(`http://localhost:3001/account?token=${token}`);
  }
);
*/



