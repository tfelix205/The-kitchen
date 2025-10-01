const menuModels = require('../models/menuModels')


exports.createMenu = async(req,res)=>{
    try {
        const {categories}=req.body

        if (!categories||categories.length === 0) {
            return res.status(400).json({
                message: "Categories are required"
            })
        }
        const menu = new menu({
            categories
        })

        await menu.save()

        res.status(201).json({
            message:"Menu Created Successfully",
            data:menu
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}


// TO get all categories an items

exports.getAllMenu = async(req,res)=>{
    try {

        if(!menu){
            return res.status(404).json({
                message:"menu not found"
            })
        }
        const data = await menuModels.find()

        res.status(200).json({
            message:"All menus gotten successfully",
            data
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}

// Add items

exports.addItemToMenu = async (req,res) => {
    try{
    const {categoryId}=req.params;
    const{name,description,price,image}=req.body;

    const breakfast = await menuModels.findById(categoryId);
    if(!breakfast){
        return res.status(404).json({
            message: "Category Not Found"
        });
    }

     menu.categories[0].items.push({
            name,description,price,image
        });

        await breakfast.save()

        res.status(200).json({
            message:"Items Added Successfully",
            data:breakfast
        })
    } catch{
        res.status(500).json({
            message:"Internal server error",
            error: error.message
        })
    }
}