// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/internal-error", invController.internalError);
router.get(
  "/add-classification",
  utilities.checkAuthorization(["Admin", "Employee"]),
  invController.buildAddClassification
);
router.get(
  "/add-car",
  utilities.checkAuthorization(["Admin", "Employee"]),
  utilities.handleErrors(invController.buildAddCar)
);
router.get(
  "",
  utilities.checkAuthorization(["Admin", "Employee"]),
  invController.buildAddMenu
);
router.get(
  "/getInventory/:classification_id",
  utilities.checkAuthorization(["Admin", "Employee"]),
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inventoryId",
  invValidate.carRules(),
  utilities.checkAuthorization(["Admin", "Employee"]),
  utilities.handleErrors(invController.editInventoryView)
);
router.get(
  "/delete/:inventoryId",
  invValidate.carRules(),
  utilities.checkAuthorization(["Admin", "Employee"]),
  utilities.handleErrors(invController.deleteInventoryView)
);
router.post(
  "/delete/",
  utilities.checkAuthorization(["Admin", "Employee"]),
  utilities.handleErrors(invController.deleteInventory)
);
router.post(
  "/add-classification",
  utilities.checkAuthorization(["Admin", "Employee"]),
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);
router.post(
  "/add-car",
  utilities.checkAuthorization(["Admin", "Employee"]),
  invValidate.carRules(),
  invValidate.checkCarData,
  utilities.handleErrors(invController.addCar)
);
router.post(
  "/update/",
  utilities.checkAuthorization(["Admin", "Employee"]),
  invValidate.carRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.editCar)
);

module.exports = router;
