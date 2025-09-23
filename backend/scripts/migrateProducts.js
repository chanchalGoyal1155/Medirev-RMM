// scripts/migrateProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Product from "../models/Product.js";
import Herb from "../models/Herb.js";

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find();

  for (const p of products) {
    let changed = false;
    const newFormula = [];
    for (const item of p.formula) {
      // if item has herbName string (old shape)
      if (item.herbName) {
        let herb = await Herb.findOne({ name: item.herbName });
        if (!herb) {
          herb = await Herb.create({ name: item.herbName, unit: item.unit || "g" });
          console.log("Created herb:", herb.name);
        }
        newFormula.push({ herb: herb._id, qty: item.qty, unit: item.unit || herb.unit });
        changed = true;
      } else if (item.herb) {
        // already a ref
        newFormula.push(item);
      }
    }
    if (changed) {
      p.formula = newFormula;
      await p.save();
      console.log("Migrated product:", p.name);
    }
  }
  console.log("Migration complete");
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
