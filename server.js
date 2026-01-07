const express = require("express");
const responseFormat = require("./src/middlewares/responseFormat");
const notFoundHandler = require("./src/middlewares/notFoundHandler");
const router = require("./src/router");
const apiRateLimiter = require("./src/middlewares/rateLimiter");
const exceptionHandler = require("./src/middlewares/exceptionHandler");

const app = express();
app.use(express.json());
app.use(apiRateLimiter);
app.use(responseFormat);

app.use("/api", router);
app.use(notFoundHandler);
app.use(exceptionHandler);

app.listen(3000, () => console.log("ok"));
