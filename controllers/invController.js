const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
/* ***************************
 *  Build detail by item view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const classification_id = req.params.inventoryId;
  const car = await invModel.getInventoryItemByInventoryId(classification_id);
  const details = await utilities.buildInventoryItemDetail(car);
  let nav = await utilities.getNav();
  const className = car.inv_make;
  res.render("./inventory/detail", {
    title: `${car.inv_year} ${car.inv_make} ${car.inv_model} - ${car.classification_name}`,
    nav,
    details,
  });
};
invCont.internalError = async (req, res, next) => {
  next({
    status: 500,
    message:
      "Internal Server Error: 'The path to the dark side is a path of no return.'",
  });
};

module.exports = invCont;
