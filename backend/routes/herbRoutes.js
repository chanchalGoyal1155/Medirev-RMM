import express from "express";
import Herb from "../models/Herb.js";

const router = express.Router();

// Create Herb
router.post("/", async (req, res) => {
  try {
    const herb = new Herb(req.body);
    await herb.save();
    res.status(201).json(herb);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Herbs
router.get("/", async (req, res) => {
  try {
    const herbs = await Herb.find();
    res.json(herbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Herb
router.get("/:id", async (req, res) => {
  try {
    const herb = await Herb.findById(req.params.id);
    if (!herb) return res.status(404).json({ error: "Herb not found" });
    res.json(herb);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Herb
router.put("/:id", async (req, res) => {
  try {
    const herb = await Herb.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!herb) return res.status(404).json({ error: "Herb not found" });
    res.json(herb);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Herb
router.delete("/:id", async (req, res) => {
  try {
    const herb = await Herb.findByIdAndDelete(req.params.id);
    if (!herb) return res.status(404).json({ error: "Herb not found" });
    res.json({ message: "Herb deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
