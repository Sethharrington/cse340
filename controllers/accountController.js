const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  res.render("./account/login", {
    title: "Login",
    errors: null,
  });
}
/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  res.render("account/register", {
    title: "Register",
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      errors: null,
    });
  }
}

async function loggedInAccountView(req, res) {
  res.render("account/logged-in-account", {
    title: "Account",
    errors: null,
  });
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function manageAccountView(req, res) {
  const inv_id = res.locals.accountData.account_id || req.params.accountId;
  const accountData = await accountModel.getAccountById(inv_id);
  res.render("account/manage", {
    title: "Manage Account",
    errors: null,
    accountData,
  });
}
async function buildUpdate(req, res, next) {
  const inv_id = res.locals.accountData.account_id || req.params.accountId;
  const accountData = await accountModel.getAccountById(inv_id);

  res.render("account/update", {
    title: "Update Account",
    errors: null,
    accountData,
  });
}
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email } = req.body;
  const accountData = res.locals.accountData;

  // Update the account information
  const updateResult = await accountModel.updateAccount(
    accountData.account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Your account has been updated successfully.");
    return res.redirect("/account/manage");
  } else {
    req.flash("notice", "There was an error updating your account.");
    return res.status(500).render("account/manage", {
      title: "Manage Account",
      errors: null,
      accountData,
    });
  }
}

async function updateAccountPassword(req, res) {
  const { account_password } = req.body;
  const accountData = res.locals.accountData;

  // Hash the new password before updating
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "There was an error processing the password update.");
    return res.status(500).render("account/manage", {
      title: "Manage Account",
      errors: null,
      accountData,
    });
  }

  // Update the account password
  const updateResult = await accountModel.updateAccountPassword(
    accountData.account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", "Your password has been updated successfully.");
    return res.redirect("/account/manage");
  } else {
    req.flash("notice", "There was an error updating your password.");
    return res.status(500).render("account/manage", {
      title: "Manage Account",
      errors: null,
      accountData,
    });
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out successfully.");
  return res.redirect("/");
}
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  loggedInAccountView,
  manageAccountView,
  updateAccount,
  updateAccountPassword,
  buildUpdate,
  logout,
};
