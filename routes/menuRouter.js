const express = require('express')
const{createMenu, getAllMenu, addItemToMenu}=require("../controllers/menuController")
const router = express.Router();

router.post('/createMenu',createMenu)

router.get('/', getAllMenu)

router.post('/add-item/:categoryId',addItemToMenu)

module.exports = router



