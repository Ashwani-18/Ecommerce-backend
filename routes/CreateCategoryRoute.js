const express = require("express");
const router = express.Router(); // Define the router
const { createCategoryController, updateCategoryController, categoryController, singleCategory, deleteCategory } = require("../controllers/CategoryController");
const { isAdmin, isUser, auth } = require("../middleware/authMiddleware");

// category creation route 
router.post("/create-category", auth, isAdmin, createCategoryController);

// update the category route 
router.put("/update-category/:id", auth, isAdmin, updateCategoryController )

// get all controller
router.get("/get-category",categoryController)

//get single category
router.get("/single-controller/:slug",singleCategory)

// delete category

router.delete("/delete-category/:id", auth, isAdmin, deleteCategory)

module.exports = router;
