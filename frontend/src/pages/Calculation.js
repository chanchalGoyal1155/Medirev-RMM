// pages/Calculation.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Calculation = () => {
  const [products, setProducts] = useState([]);
  const [herbs, setHerbs] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [targetQty, setTargetQty] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductsAndHerbs = async () => {
      try {
        const [pRes, hRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/herbs")
        ]);
        setProducts(pRes.data);
        setHerbs(hRes.data);
      } catch (err) {
        setError("Failed to fetch products or herbs");
      }
    };
    fetchProductsAndHerbs();
  }, []);

  const calculate = async () => {
    if (!selectedProduct || !targetQty) {
      setError("Select product and enter target quantity");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/calc", {
        productId: selectedProduct,
        targetQty: Number(targetQty),
      });

      const productReq = res.data.requirements; // only herbs in formula
      // Merge with all herbs, show 0 if not in formula
      const merged = herbs.map((h) => {
        const found = productReq.find((r) => r.herbName === h.name);
        return {
          name: h.name,
          qty: found ? found.requiredQty : 0,
          unit: h.unit,
        };
      });

      setRequirements(merged);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Calculation failed");
      setRequirements([]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Calculate Herbs for Target Quantity</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">--Select Product--</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.baseQuantity} {p.baseUnit})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Target Quantity"
          value={targetQty}
          onChange={(e) => setTargetQty(e.target.value)}
        />

        <button onClick={calculate}>Calculate</button>
      </div>

      {requirements.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Herb</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((r, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{r.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{r.qty}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Calculation;
