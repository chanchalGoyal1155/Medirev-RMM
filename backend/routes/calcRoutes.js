// routes/calcRoutes.js
import express from "express";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

const router = express.Router();

// Calculate requirements (returns totals + stock compare)
router.post("/", async (req, res) => {
  try {
    const { productId, targetQty } = req.body;
    if (!productId || !targetQty) return res.status(400).json({ error: "productId and targetQty required" });

    const product = await Product.findById(productId).populate({ path: "formula.herb", model: "Herb" });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const scale = targetQty / product.baseQuantity;
    const requirements = [];

    let okToProduce = true;

    for (const item of product.formula) {
      const requiredQty = +(item.qty * scale).toFixed(6);
      // find stock for this herb
      const stock = await Stock.findOne({ herb: item.herb._id });
      const availableQty = stock ? stock.availableQty : 0;
      const shortfall = +(Math.max(0, requiredQty - availableQty)).toFixed(6);
      if (shortfall > 0) okToProduce = false;

      requirements.push({
        herbId: item.herb._id,
        herbName: item.herb.name,
        requiredQty,
        unit: item.unit,
        availableQty,
        shortfall
      });
    }

    res.json({ product: product.name, baseUnit: product.baseUnit, targetQty, okToProduce, requirements });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
