// routes/calcRoutes.js
import express from "express";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

const router = express.Router();

/* ======================================================
   🔁 UNIT CONVERSION HELPERS (NEW – VERY IMPORTANT)
   👉 Calculation hamesha BASE UNIT (g / ml) me hogi
   👉 Display unit alag ho sakti hai
====================================================== */

// mass base = gram
const toBaseUnit = (qty, unit) => {
  if (unit === "kg") return qty * 1000;
  if (unit === "mg") return qty / 1000;
  if (unit === "l") return qty * 1000;    // l → ml
  return qty;  // g or ml base hai
};

// base (gram) se wapas herb unit me
const fromBaseUnit = (qty, unit) => {
  if (unit === "kg") return qty / 1000;
  if (unit === "mg") return qty * 1000;
  if (unit === "l") return qty / 1000;    // ml → l
  return qty; // g
};

/* ======================================================
   📌 Calculate requirements + stock comparison
====================================================== */
router.post("/", async (req, res) => {
  try {
    const { productId, targetQty } = req.body;

    // 🔒 basic validation
    if (!productId || !targetQty) {
      return res.status(400).json({
        error: "productId and targetQty required",
      });
    }

    // 🔍 fetch product with populated herbs
    const product = await Product.findById(productId).populate({
      path: "formula.herb",
      model: "Herb",
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    /* ======================================================
       🔢 SCALE CALCULATION
       Example:
       baseQuantity = 10 g
       targetQty   = 1000 g
       scale       = 100
    ====================================================== */
    const scale = targetQty / product.baseQuantity;

    const requirements = [];
    let okToProduce = true;

    /* ======================================================
       🔁 MAIN LOOP – SAFE UNIT CALCULATION
    ====================================================== */
    for (const item of product.formula) {
      // 🟢 skip zero qty herbs (optional safety)
      if (!item.qty || item.qty === 0) {
        requirements.push({
          herbId: item.herb._id,
          herbName: item.herb.name,
          requiredQty: 0,
          unit: item.unit,
          availableQty: 0,
          shortfall: 0,
        });
        continue;
      }

      // ✅ STEP 1: formula qty → BASE UNIT (gram)
      const formulaQtyInBase = toBaseUnit(item.qty, item.unit);

      // ✅ STEP 2: scale applied (still in gram)
      const requiredQtyBase = +(formulaQtyInBase * scale).toFixed(6);

      // 🔍 fetch stock for this herb
      const stock = await Stock.findOne({ herb: item.herb._id });

      // ✅ STEP 3: stock qty → BASE UNIT
      const availableQtyBase = stock
        ? toBaseUnit(stock.availableQty, stock.unit)
        : 0;

      // ✅ STEP 4: shortfall calculation (SAFE)
      const shortfallBase = +(
        Math.max(0, requiredQtyBase - availableQtyBase)
      ).toFixed(6);

      if (shortfallBase > 0) okToProduce = false;

      // ✅ STEP 5: convert BACK to herb unit for display
      const requiredQtyDisplay = +fromBaseUnit(
        requiredQtyBase,
        item.unit
      ).toFixed(6);

      const availableQtyDisplay = +fromBaseUnit(
        availableQtyBase,
        item.unit
      ).toFixed(6);

      const shortfallDisplay = +fromBaseUnit(
        shortfallBase,
        item.unit
      ).toFixed(6);

      // ✅ FINAL PUSH (UI SAFE DATA)
      requirements.push({
        herbId: item.herb._id,
        herbName: item.herb.name,
        requiredQty: requiredQtyDisplay,
        unit: item.unit, // 👈 SAME unit as formula (no confusion)
        availableQty: availableQtyDisplay,
        shortfall: shortfallDisplay,
      });
    }

    /* ======================================================
       ✅ FINAL RESPONSE
    ====================================================== */
    res.json({
      product: product.name,
      baseUnit: product.baseUnit,
      targetQty,
      okToProduce,
      requirements,
    });
  } catch (err) {
    console.error("Calc Error:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
