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
invCont.buildAddMenu = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/add-menu", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classifications = await invModel.getClassifications();

  if (classifications.length === 0) {
    req.flash(
      "notice",
      "Sorry, there are no classifications available. Please add a classification first."
    );
    res.status(404).render("./inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
    return;
  }
  res.render("./inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};
invCont.buildAddCar = async function (req, res, next) {
  const classificationSelect = await utilities.buildClassificationList();
  let nav = await utilities.getNav();

  res.render("./inventory/add-car", {
    title: "New Car",
    nav,
    classificationSelect,
    errors: null,
  });
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryItemByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-car", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Add classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addClassificationResult =
    invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (addClassificationResult) {
    req.flash(
      "notice",
      `The classification "${classification_name}" was added successfully.`
    );
    res.status(201).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      `Sorry, there was an error adding the classification "${classification_name}".`
    );
    res.status(500).render("inventory/add-classification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Add car
 * ************************** */

invCont.addCar = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const inv_car = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  };
  const addCarResult = await invModel.addCar(inv_car);
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  if (addCarResult) {
    req.flash(
      "notice",
      `The car "${inv_make} ${inv_model} (${inv_year})" was added successfully.`
    );
    res.status(201).render("./inventory/add-car", {
      title: "New Car",
      nav,
      classificationSelect: classificationSelect,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      `Sorry, there was an error adding the car "${inv_make} ${inv_model} (${inv_year})".`
    );
    res.status(500).render("./inventory/add-car", {
      title: "New Car",
      nav,
      classificationSelect: classificationSelect,
      errors: null,
    });
  }
};
/* ***************************
 *  Edit car
 * ************************** */

invCont.editCar = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;
  const inv_car = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  };
  const updateCarResult = await invModel.editCar(inv_car);
  let nav = await utilities.getNav();

  if (updateCarResult) {
    req.flash(
      "notice",
      `The car "${inv_make} ${inv_model} (${inv_year})" was updated successfully.`
    );
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      inv_car.classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;

    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.internalError = async (req, res, next) => {
  next({
    status: 500,
    message:
      "Internal Server Error: 'The path to the dark side is a path of no return.'",
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};
module.exports = invCont;
