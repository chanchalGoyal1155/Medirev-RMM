import mongoose from "mongoose";

const herbSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true }, // g, ml, kg, etc.
  density: { type: Number, default: null }, // optional for conversions
});

export default mongoose.model("Herb", herbSchema);
