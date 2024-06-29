require("dotenv").config();
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./passportConfig.js');

//Routers
const usersRouter = require("./src/users/routes");
const authRouter = require("./src/auth/routes");

//
const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json());
app.use(morgan("dev"));

const devOrigin = ["http://localhost", /http:\/\/localhost:.*/];
const prodOrigin = process.env.FRONT_END_BASE_URL;
const origin = process.env.NODE_ENV !== "production" ? devOrigin : prodOrigin;
// remember to change NODE_ENV in .env! 

app.use(cors({
  origin,
  credentials: true,
}));
////////////////////////
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none'
    },
  }));

} else {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));
}
//////////
// Authenticate all routes and add user data to req.user
app.use(passport.initialize());
app.use(passport.authenticate('session'));
passport.serializeUser(passportConfig.serialize);
passport.deserializeUser(passportConfig.deserialize);

app.get('/', (req, res) => {
  console.log(`server.js sending res.status(200) - getting req.user.email_address:`, res.user.email_address);
  res.status(200).send(
    req.isAuthenticated() ? `Logged in as ${req.user.email_address}.` : 'Logged out.'
  );
});

app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hellooo World! I am the TODO Server!');
});

app.listen(port, () => {
  console.log(`TODO Server is running on port ${port}, using the ${process.env.NODE_ENV} environment.`);
});
