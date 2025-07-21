import Product from "../models/ProductModel.js";

// Create a new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      createdBy: req.user.userId,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const { status = "active", search = "", minPrice, maxPrice } = req.query;
    let filter = {};
    // Status filter
    if (status !== "all") filter.status = status;

    // Text search (name or description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // if (status === "active") filter.status = "active";
    // else if (status === "hidden") filter.status = "hidden";

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// delete a product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

//hide a product (Admin only)
export const hideProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { productId } = req.params;
    const updated = await Product.findByIdAndUpdate(
      productId,
      { status: "hidden" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to hide product" });
  }
};

// restore product from hide(Admin only)
export const restoreProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { productId } = req.params;
    const updated = await Product.findByIdAndUpdate(
      productId,
      { status: "active" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to restore product" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
