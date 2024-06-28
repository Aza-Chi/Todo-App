require("dotenv").config();
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hellooo World! I am the TODO Server!');
});

app.listen(port, () => {
  console.log(`TODO Server is running on port ${port}`);
});
