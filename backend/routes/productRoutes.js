// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";
import Herb from "../models/Herb.js";
import { body, validationResult } from "express-validator";
import auth from "../middlewares/authMiddleware.js"; // protect create/update/delete

const router = express.Router();

// ====== NEW: Unit Conversion Map ======
const unitConversion = {
  g: { g: 1, kg: 0.001, mg: 1000 },
  kg: { g: 1000, kg: 1, mg: 1000000 },
  mg: { g: 0.001, kg: 0.000001, mg: 1 },
  ml: { ml: 1, l: 0.001 },
  l: { ml: 1000, l: 1 },
};

// ====== NEW: Unit Type Map ======
const unitType = {
  g: "mass",
  kg: "mass",
  mg: "mass",
  ml: "volume",
  l: "volume",
};

// ====== NEW: Conversion Function ======
const convertQty = (value, fromUnit, toUnit) => {
  // ✅ only convert if same type
  if (unitType[fromUnit] !== unitType[toUnit]) {
    // same-type conversion नहीं है, skip
    return value;
  }

  if (!unitConversion[fromUnit] || !unitConversion[fromUnit][toUnit]) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`);
  }
  return value * unitConversion[fromUnit][toUnit];
};

// Create Product (protected)
router.post(
  "/",
  // auth,
  body("name").notEmpty(),
  body("category").notEmpty(),
  body("baseQuantity").isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, category, baseQuantity, baseUnit, formula } = req.body;

      // ====== NEW: fetch all herbs for zero-fill ======
      const allHerbs = await Herb.find();
      const userFormula = formula || [];

      // ====== NEW: create formula with zero-fill and unit normalization ======
      const newFormula = allHerbs.map((herb) => {
        const f = userFormula.find(
          (item) =>
            (item.herbId && item.herbId == herb._id) ||
            (item.herbName && item.herbName === herb.name)
        );

        if (f) {
          // ✅ convert to herb's standard unit (same-type only)
          let qty = f.qty;
          let unit = f.unit || herb.unit;
          if (unit !== herb.unit) {
            qty = convertQty(f.qty, unit, herb.unit);
            unit = herb.unit;
          }
          return { herb: herb._id, qty, unit };
        } else {
          return { herb: herb._id, qty: 0, unit: herb.unit };
        }
      });

      const product = new Product({
        name,
        category,
        baseQuantity,
        baseUnit,
        formula: newFormula,
      });
      await product.save();
      await product.populate({ path: "formula.herb", model: "Herb" });

      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Get All Products (populated)
router.get("/", async (req, res) => {
  const products = await Product.find().populate({
    path: "formula.herb",
    model: "Herb",
  });
  res.json(products);
});

// Get Single Product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "formula.herb",
    model: "Herb",
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// Update Product (protected)
router.put("/:id", /*auth,*/ async (req, res) => {
  try {
    const { name, category, baseQuantity, baseUnit, formula } = req.body;

    // ====== NEW: fetch all herbs for zero-fill ======
    const allHerbs = await Herb.find();
    const userFormula = formula || [];

    // ====== NEW: create formula with zero-fill and unit normalization ======
    const newFormula = allHerbs.map((herb) => {
      const f = userFormula.find(
        (item) =>
          (item.herbId && item.herbId == herb._id) ||
          (item.herbName && item.herbName === herb.name)
      );

      if (f) {
        // ✅ convert to herb's standard unit (same-type only)
        let qty = f.qty;
        let unit = f.unit || herb.unit;
        if (unit !== herb.unit) {
          qty = convertQty(f.qty, unit, herb.unit);
          unit = herb.unit;
        }
        return { herb: herb._id, qty, unit };
      } else {
        return { herb: herb._id, qty: 0, unit: herb.unit };
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, baseQuantity, baseUnit, formula: newFormula },
      { new: true, runValidators: true }
    ).populate({ path: "formula.herb", model: "Herb" });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Product (protected)
router.delete("/:id", /*auth,*/ async (req, res) => {
  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Deleted" });
});

export default router;
