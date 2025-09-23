// routes/stockRoutes.js
import express from "express";
import Stock from "../models/Stock.js";
import Herb from "../models/Herb.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add or update stock for a herb (protected)
router.post("/", auth, async (req, res) => {
  const { herbId, qty, unit } = req.body;
  if (!herbId || qty == null) return res.status(400).json({ error: "herbId and qty required" });

  const herb = await Herb.findById(herbId);
  if (!herb) return res.status(404).json({ error: "Herb not found" });

  let stock = await Stock.findOne({ herb: herbId });
  if (!stock) {
    stock = await Stock.create({ herb: herbId, availableQty: qty, unit: unit || herb.unit });
  } else {
    stock.availableQty = Number(stock.availableQty) + Number(qty); // or set, based on design
    stock.lastUpdated = new Date();
    await stock.save();
  }
  await stock.populate("herb").execPopulate();
  res.json(stock);
});

// Get all stocks
router.get("/", async (req, res) => {
  const stocks = await Stock.find().populate("herb");
  res.json(stocks);
});

// Get stock by herb id
router.get("/:herbId", async (req, res) => {
  const stock = await Stock.findOne({ herb: req.params.herbId }).populate("herb");
  if (!stock) return res.status(404).json({ error: "Stock not found for this herb" });
  res.json(stock);
});

export default router;
