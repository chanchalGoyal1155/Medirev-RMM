import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import calcRoutes from "./routes/calcRoutes.js";
import herbRoutes from "./routes/herbRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/herbs", herbRoutes);
app.use("/api/products", productRoutes);
app.use("/api/calc", calcRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/auth", authRoutes);
// basic route
app.get("/", (req, res) => {
    res.send("Raw Material Management API running...");
});


// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));