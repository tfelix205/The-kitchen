const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [itemSchema],
});

const menuSchema = new mongoose.Schema({
  categories: [categorySchema],
});

const Breakfast = mongoose.model("Breakfast", menuSchema);

module.exports = Breakfast;
