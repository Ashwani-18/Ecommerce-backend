const { default: slugify } = require("slugify");
const CategoryModel = require("../models/CategoryModel");
const userModel = require("../models/userModel");


exports.createCategoryController = async(req, res) => {
    try {
        const{name} = req.body;

        if(!name){
            res.status(400).json({
                message: "name is required"
            })
        }

        const existingCategory = await CategoryModel.findOne({name})
        if(existingCategory){
            res.status(200).json({
                success: true,
                message: "category already exist"
            })
        }

        const category = await new CategoryModel({name, slug:slugify(name)}).save()
        res.status(201).json({
            success: true,
            message: "new category created",
            category
        })

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "error in category"
    })
    }
}


exports.updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update the category",
    });
  }
};

exports.categoryController = async(req,res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(201).json({
            success: true,
            message: "category successfull",
            category,
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "error in controller"
        })
    }
}

exports.singleCategory = async(req, res) => {
    try {
        const category = await CategoryModel.findOne({slug: req.params.slug})
        res.status(201).json({
            success: true,
            message: "successfull",
            category,
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "unable to fetch "
        })
    }
}
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete(id); // ✅ pass id directly

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete the category",
    });
  }
};
