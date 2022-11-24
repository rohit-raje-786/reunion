require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const winston = require("winston");
const userAgentParser = require("ua-parser-js");
const winstonElasticsearch = require("winston-elasticsearch");

const esTransportOpts = {
  indexPrefix: "logging-api",
  indexSuffixPattern: "YYYY-MM-DD",
  clientOpts: {
    node: process.env.ES_URL,
    maxRetries: 5,
    requestTimeout: 10000,
    sniffOnStart: false,
    auth: {
      username: process.env.ES_USERNAME,
      password: process.env.ES_PASSWORD,
    },
  },
  source: process.env.LOG_SOURCE || "api",
};

const esTransport = new winstonElasticsearch.ElasticsearchTransport(
  esTransportOpts
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      json: true,
    }),
    esTransport, //Add es transport
  ],
});

const morganJSONFormat = () =>
  JSON.stringify({
    method: ":method",
    url: ":url",
    http_version: ":http-version",
    remote_addr: ":remote-addr",
    remote_addr_forwarded: ":req[x-forwarded-for]", //Get a specific header
    response_time: ":response-time",
    status: ":status",
    content_length: ":res[content-length]",
    timestamp: ":date[iso]",
    user_agent: ":user-agent",
  });

function parseUserAgent(data) {
  if (data.user_agent) {
    const ua = userAgentParser(data.user_agent);
    if (ua.browser) {
      data.user_agent_browser_name = ua.browser.name;
      data.user_agent_browser_version = ua.browser.major || ua.browser.version;
    }
    if (ua.os) {
      data.user_agent_os_name = ua.os.name;
      data.user_agent_os_version = ua.os.version;
    }
  }
}

app.use(
  morgan(morganJSONFormat(), {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        console.log(data);
        parseUserAgent(data); //Enrich data
        return logger.info("accesslog", data);
      },
    },
  })
);

module.exports = logger;
