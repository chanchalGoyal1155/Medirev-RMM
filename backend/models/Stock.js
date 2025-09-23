// models/Stock.js
import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  herb: { type: mongoose.Schema.Types.ObjectId, ref: "Herb", required: true, unique: true },
  availableQty: { type: Number, required: true, default: 0 }, // in herb.unit
  unit: { type: String, required: true }, // duplicate to avoid joins
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Stock", stockSchema);
