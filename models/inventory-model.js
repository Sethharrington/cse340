const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}
/* ***************************
 *  Get inventory items detail by inventory_id
 * ************************** */
async function getInventoryItemByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory i
      JOIN public.classification c
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1;`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classification_name]
    );
    return result.rows[0].classification_id;
  } catch (error) {
    console.error("addClassification error: " + error);
    throw error;
  }
}
async function addCar(inv_car) {
  try {
    const result = await pool.query(
      `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        inv_car.inv_make,
        inv_car.inv_model,
        inv_car.inv_year,
        inv_car.inv_description,
        inv_car.inv_image,
        inv_car.inv_thumbnail,
        inv_car.inv_price,
        inv_car.inv_miles,
        inv_car.inv_color,
        inv_car.classification_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addCar error: " + error);
    throw error;
  }
}
async function editCar(inv_car) {
  try {
    const result = await pool.query(
      `UPDATE public.inventory 
        SET 
        inv_make = $1
        ,inv_model = $2
        ,inv_year = $3
        ,inv_description = $4
        ,inv_image = $5
        ,inv_thumbnail = $6
        ,inv_price = $7
        ,inv_miles = $8
        ,inv_color = $9
        ,classification_id = $10
        WHERE inv_id = $11
        RETURNING *`,
      [
        inv_car.inv_make,
        inv_car.inv_model,
        inv_car.inv_year,
        inv_car.inv_description,
        inv_car.inv_image,
        inv_car.inv_thumbnail,
        inv_car.inv_price,
        inv_car.inv_miles,
        inv_car.inv_color,
        inv_car.classification_id,
        inv_car.inv_id,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error("model error: " + error);
    throw error;
  }
}

async function deleteInventoryItemById(inv_id) {
  try {
    const result = await pool.query(
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *",
      [inv_id]
    );
    return result;
  } catch (error) {
    console.error("delete error: " + error);
    throw error;
  }
}
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryItemByInventoryId,
  addClassification,
  addCar,
  editCar,
  deleteInventoryItemById,
};
