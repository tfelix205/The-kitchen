const Breakfast = require("../models/breakfastModels");

exports.createMenu = async (req, res) => {
  try {
    const menu = new Breakfast(req.body);
    const saved = await menu.save();
    res.status(201).json({ message: "Menu created", 
    data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllMenus = async (req, res)=>{
try{
    const menus = await Breakfast.find();
    res.status(200).json({message: "Menus gotten successfully",
      data: menus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addItemToCategory = async (req, res) => {
  try {
    const { categoryName, item } = req.body;

    const menu = await Breakfast.findOne();

    if (!menu) return res.status(404).json({ message: 'Menu not found' });

    const category = menu.categories.find(cat => cat.name === categoryName);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.items.push(item);

    await menu.save();

    res.status(200).json({ message: 'Item added successfully', data: menu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getItemByName = async (req, res) => {
  try {
    const { itemName } = req.params;

    const menu = await Breakfast.findOne();

    if (!menu) return res.status(404).json({ message: 'Menu not found' });

    for (const category of menu.categories) {
      const item = category.items.find(i => i.itemName===itemName);
      if (item) return res.status(200).json({ item });
    }

    res.status(404).json({ message: 'Item not found' });
    }catch (error) {
    res.status(500).json({ error: error.message });
  }
  }




