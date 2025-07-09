const fs = require("fs");
const ProductModel = require("../models/ProductModel");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

  
    const product = new ProductModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path); // ✅ Read file data
      product.photo.contentType = photo.type;            // ✅ Set contentType correctly
    }

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to create product",
      error: error.message,
    });
  }
};

exports.getProductController = async(req,res) => {
     try {
        const products = await ProductModel.find({}).select('-photo').limit(12).sort({ createdAt: -1 }).populate("category")
        res.status(201).json({
            success: true,
            message: "successfull",
            products,
        })
     } catch (error) {
        res.status(401).json({
            success: false,
            message: "failed to get the product"
        })
     }
}
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      message: "Fetched successfully",
      product, // ✅ correct key
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

exports.getProductPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");

    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.send(product.photo.data);
    }

    res.status(404).json({ success: false, message: "Photo not found" });
  } catch (error) {
    console.error("Error fetching product photo:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteProductController = async(req, res) => {
  try {
    const products = await ProductModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(201).json({
      success: true,
      message: "successfully deleted"
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "unable to delete the controller"
    })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // 🛡️ Safely update base fields
    const product = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true } // return the updated product
    );



    // 📷 Handle photo upload if provided
    if (photo) {
      if (photo.size > 1 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "Photo should be less than 1MB",
        });
      }

      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save(); // must save after photo update
    }

    // 🟢 Success
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("update product error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update product",
      error: error.message,
    });
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.cid;
    const products = await ProductModel.find({ category: categoryId })
      .populate("category")
      .select("-photo");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getProductByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category",
    });
  }
};
exports.searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    res.status(200).json({
      success: true,
      products: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to search product",
      error,
    });
  }
};

// controllers/productController.js
exports.getFourProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .select("-photo")
      .limit(4)
      .sort({ createdAt: -1 }); // Optional: show newest first

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch 4 products",
    });
  }
};


