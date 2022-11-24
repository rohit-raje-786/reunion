require("dotenv").config();
// require("typescript-sdk/dist/integrations/express/register");
const express = require("express");
const app = express();
const InitiateMongoServer = require("./config/db");
const userRegister = require("./routes/register");
const bodyParser = require("body-parser");
const logger = require("./helper/logger");

InitiateMongoServer();

app.use(bodyParser.json());

app.get("/", function (req, res) {
  logger.info("Hi there !");
  res.status(200).send("Welcome home");
});

app.use("/register", userRegister);

var httpPORT = process.env.PORT;

app.listen(httpPORT, "192.168.238.41", function () {
  console.log("Server is listening on port: " + httpPORT);
});
