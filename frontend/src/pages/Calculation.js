import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Calculation.css"; // Add this import

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
          axios.get(`${process.env.REACT_APP_API_URL}/api/products`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/herbs`)
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
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/calc`, {
        productId: selectedProduct,
        targetQty: Number(targetQty),
      });

      const productReq = res.data.requirements;
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
    <div className="calc-container">
      <h2 className="calc-title">🌿 Calculate Herbs for Target Quantity</h2>

      {error && <p className="calc-error">{error}</p>}

      <div className="calc-form">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="calc-select"
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
          className="calc-input"
        />

        <button onClick={calculate} className="calc-btn">Calculate</button>
      </div>

      {requirements.length > 0 && (
        <div className="calc-table-wrapper">
          <table className="calc-table">
            <thead>
              <tr>
                <th>Herb</th>
                <th>Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.qty}</td>
                  <td>{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Calculation;