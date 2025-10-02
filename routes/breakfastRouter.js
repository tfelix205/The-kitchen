const express = require("express");
const router = express.Router();
const breakfastController = require("../controllers/breakfastController");

router.post("/create", breakfastController.createMenu);
router.get("/", breakfastController.getAllMenus);

module.exports = router;
