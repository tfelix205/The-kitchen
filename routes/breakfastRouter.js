const express = require("express");
const router = express.Router();
const breakfastController = require("../controllers/breakfastController");

router.post("/create", breakfastController.createMenu);
router.get("/", breakfastController.getAllMenus);
router.post('/add-item', breakfastController.addItemToCategory);
router.get('/item/:itemName', breakfastController.getItemByName);


module.exports = router;


