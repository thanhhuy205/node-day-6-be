const express = require("express");
const responseFormat = require("./src/middlewares/responseFormat");
const notFoundHandler = require("./src/middlewares/notFoundHandler");
const router = require("./src/router");
const apiRateLimiter = require("./src/middlewares/rateLimiter");
const exceptionHandler = require("./src/middlewares/exceptionHandler");

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(apiRateLimiter);
app.use(responseFormat);

app.use("/api", router);
app.use(notFoundHandler);
app.use(exceptionHandler);

app.listen(3000, () => console.log("ok"));
