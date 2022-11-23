require("dotenv").config();
const express = require("express");
const app = express();
const InitiateMongoServer = require("./config/db");
const userRegister = require("./routes/register");
const bodyParser = require("body-parser");

InitiateMongoServer();

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.status(200).send("Welcome home");
});

app.use("/register", userRegister);

var httpPORT = process.env.PORT;

app.listen(httpPORT, "192.168.238.41", function () {
  console.log("Server is listening on port: " + httpPORT);
});
