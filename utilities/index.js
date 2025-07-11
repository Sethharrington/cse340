const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.getAccountManageView = async function (req, res, next) {
  const accountData = res.locals.accountData;
  let pageContent = "";
  if (!accountData) {
    req.flash("notice", "Please log in to manage your account.");
    return res.redirect("/account/login");
  } else {
    pageContent = `<h2> Welcome ${accountData.account_firstname}</h2>`;
  }

  if (["Admin", "Employee"].includes(accountData.account_type)) {
    pageContent += `<h3>Inventory Management</h3>
    <p> <a href="/inv/">Inventory Management</a> </p>
    `;
  }
  return pageContent;
};
/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += `
      <h3
      class="status ${
        vehicle.inv_status == "Available" ? "status_available" : "status_sold"
      }"> ${vehicle.inv_status}</h3>`;
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildInventoryItemDetail = async function (car) {
  let detailView = `
  <hr/>
  <div class="details">
    <div>
    <p class="status ${
      car.inv_status == "Available" ? "status_available" : "status_sold"
    }">${car.inv_status}</p>
      <img src="${car.inv_image}" alt="Image of ${car.inv_make} ${
    car.inv_model
  } on CSE Motors" />
    </div>
    <div class="details-data">
      <h2>${car.inv_make} Details</h2>
      <hr/>
      <p>Description: ${car.inv_description}</p>
      <hr/>
      <p>Miles: ${new Intl.NumberFormat("en-US").format(car.inv_miles)}</p>
      <hr/>
      <p>Color: ${car.inv_color}</p>
      <hr/>
      <span>Price: $${new Intl.NumberFormat("en-US").format(
        car.inv_price
      )} </span>
      <hr/>
    </div>
  </div>
  `;
  return detailView;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};
Util.checkAuthorization = (allowedRoles = []) => {
  return (req, res, next) => {
    const userType = res.locals.accountData?.account_type;
    if (userType && allowedRoles.includes(userType)) {
      next();
    } else {
      req.flash("notice", "You are not authorized to view this page");
      return res.redirect("/");
    }
  };
};
Util.checkLoginLogout = (req, res, next) => {
  const isLoggedIn = req.session.loggedIn || false;
  if (isLoggedIn) {
    req.flash("notice", "Welcome back!");
  } else {
    req.flash("notice", "Welcome to our site! Please log in or register.");
  }
  let logLink = res.locals.loggedin
    ? '<a title="Click to log in" href="/account/login">My Account</a>'
    : '<a title="Click to log out" href="/account/logout">Logout</a>';
  next();
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

module.exports = Util;
