// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Herb from "../models/Herb.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Herb.deleteMany({});
  await Product.deleteMany({});
  await Stock.deleteMany({});

  const amla = await Herb.create({ name: "Amla", unit: "g" });
  const bhr = await Herb.create({ name: "Bhringraj", unit: "g" });
  const neem = await Herb.create({ name: "Neem", unit: "g" });
  const carrier = await Herb.create({ name: "Carrier Oil", unit: "ml" });

  const product = await Product.create({
    name: "Medi Hair Oil",
    category: "Oil",
    baseQuantity: 2,
    baseUnit: "ml",
    formula: [
      { herb: amla._id, qty: 0.5, unit: "g" },
      { herb: bhr._id, qty: 0.3, unit: "g" },
      { herb: neem._id, qty: 0.2, unit: "g" },
      { herb: carrier._id, qty: 1.0, unit: "ml" }
    ]
  });

  await Stock.create({ herb: amla._id, availableQty: 1000, unit: "g" });
  await Stock.create({ herb: bhr._id, availableQty: 500, unit: "g" });
  await Stock.create({ herb: neem._id, availableQty: 300, unit: "g" });
  await Stock.create({ herb: carrier._id, availableQty: 10000, unit: "ml" });

  console.log("Seeding done");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
