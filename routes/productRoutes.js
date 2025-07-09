const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/authMiddleware");
const { createProduct, getProductController, getSingleProduct, getProductPhotoController, updateProduct, getProductByCategory, searchProductController, getFourProducts } = require("../controllers/productController");
const formidable = require("express-formidable");


router.post(
  "/create-product",
  auth,
  isAdmin,
  formidable(), 
  createProduct
);

// get products 
router.get("/get-products", getProductController)

// single product
router.get("/get-products/:slug", getSingleProduct)

// photo controller 
router.get("/product-photo/:pid", getProductPhotoController)

// update product 
router.put("/update-product/:pid",auth, isAdmin, formidable(), updateProduct)

router.get("/category/:cid/products", getProductByCategory);

//search product
router.get("/search/:keyword",searchProductController)

// fetch four products 
// routes/productRoutes.js
router.get("/get-4-products", getFourProducts);

module.exports = router;
