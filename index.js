const appRoot = require("app-root-path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require(`${appRoot}/src/routes`);
const error = require(`${appRoot}/src/middleware/error`);
const {startServer} = require(`${appRoot}/lib/server`);

const app = express();

// Enable CORS
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

// JSON body parser
app.use(bodyParser.json());

// Routes handlers
app.use("/", routes);

// 404 and 500 errors handler
app.use([error.notFound, error.server]);

startServer(app);

module.exports = app;