const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    categories:[
        {
     name: {
        type: String,
        required: true,
     },
      items:[{
            foodName:{
                type:String,
                required:true
            } ,
            description:{
            type: String,
            },
            price: {
                type: Number,
                required:true
            },
            imageUrl:{
                type:String
            },
            addons:{
                type:String,
                required:true
            }
        }]
    }]
},{timestamps: true});
const menuModels = mongoose.model('menu', menuSchema);
module.exports = menuModels