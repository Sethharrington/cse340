const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");

const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // Classification is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "New Classification",
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Add Car Data Validation Rules
 * ********************************* */
validate.carRules = () => {
  return [
    // Classification is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please select a classification."), // on error this message is sent.

    // Make is required and must be string
    body("inventory_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // Model is required and must be string
    body("inventory_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // Year is required and must be string
    body("inventory_year")
      .trim()
      .isDate({ format: "YYYY" }) // YYYY format for year
      .escape()
      .notEmpty()
      //   .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid year."), // on error this message is sent.

    // Description is required and must be string
    body("inventory_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // Image URL is required and must be valid URL
    body("inventory_image")
      .trim()
      .escape()
      .notEmpty()
      .isURL()
      .withMessage("Please provide a valid image URL."), // on error this message is sent.

    // Thumbnail URL is required and must be valid URL
    body("inventory_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isURL()
      .withMessage("Please provide a valid image URL."), // on error this message is sent.

    // Price is required and must be numeric
    body("inventory_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price."), // on error this message is sent.
    // Price is required and must be numeric
    body("inventory_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide mileage."), // on error this message is sent.
    // Price is required and must be numeric
    body("inventory_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a Color."), // on error this message is sent.
  ];
};

validate.checkCarData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classifications = await invModel.getClassifications();
    res.render("./inventory/add-car", {
      title: "New Car",
      nav,
      classifications: classifications.rows,
      errors,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
