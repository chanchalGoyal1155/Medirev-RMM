import express from "express";
import Blog from "../models/Blog.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create Blog
router.post("/", async (req, res) => {
  try {
    const { productId, title, content } = req.body;
    if (!productId || !title || !content) return res.status(400).json({ error: "All fields required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const blog = new Blog({ product: productId, title, content });
    await blog.save();
    await blog.populate({ path: "product", model: "Product" });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find().populate({ path: "product", model: "Product" });
  res.json(blogs);
});

// Get Single Blog
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate({ path: "product", model: "Product" });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
});

// Update Blog
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true, runValidators: true })
      .populate({ path: "product", model: "Product" });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Blog
router.delete("/:id", async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json({ message: "Deleted" });
});

export default router;
