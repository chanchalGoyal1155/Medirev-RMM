// models/Product.js
import mongoose from "mongoose";

const formulaItemSchema = new mongoose.Schema({
  herb: { type: mongoose.Schema.Types.ObjectId, ref: "Herb", required: true },
  qty: { type: Number, required: true }, // amount per baseQuantity (in herb.unit)
  unit: { type: String, required: true } // duplicate unit for quick display
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  baseQuantity: { type: Number, required: true },
  baseUnit: { type: String, required: true },
  formula: [formulaItemSchema]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
