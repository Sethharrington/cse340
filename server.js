/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const invController = require("./controllers/invController");
const utilities = require("./utilities/");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", utilities.handleErrors(inventoryRoute));
app.use("/detail", utilities.handleErrors(inventoryRoute));
// app.use("/internal-error", utilities.handleErrors(inventoryRoute));
app.use("/internal-error", invController.internalError);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404,
    message:
      "Follow the correct PATH you should, or the dark side of the page you will follow.",
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  // console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
    image = "/images/errors/yoda.webp";
    className = "not-found";
  } else if (err.status == 505) {
    message =
      "Internal Server Error: 'The path to the dark side is a path of no return.'";
    image = "/images/errors/Darth-Vader.webp";
    className = "internal-error";
  } else {
    message = "'Do or do not, there is no try.' An error has ocurred.";
    image = "/images/errors/yoda.webp";
    className = "not-found";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    image,
    className,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
