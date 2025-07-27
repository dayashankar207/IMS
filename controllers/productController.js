import Product from "../models/productModel.js";

const newProduct = async (req, res) => {
  const { name, sku, price, category } = req.body;

  if (!name || !sku || !price) {
    return res.status(400).json({ error: "Name, SKU, and price are required" });
  }

  try {
    const product = new Product({ name, sku, price, category });
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "SKU already exists" });
    }
    console.error("Error in productController -> newProduct:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error in productController -> getProduct:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, sku, price, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, price, category },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "SKU already exists" });
    }
    console.error("Error in productController -> updateProduct:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error in productController -> deleteProduct:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export { newProduct, getProduct, updateProduct, deleteProduct };
