import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css"; // Import the CSS

const Products = () => {
  const [products, setProducts] = useState([]);
  const [herbs, setHerbs] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [baseQuantity, setBaseQuantity] = useState("");
  const [baseUnit, setBaseUnit] = useState("");
  const [formula, setFormula] = useState([{ herbId: "", qty: 0, unit: "" }]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);

  const units = ["g", "ml", "kg", "l"];
  const categoryOptions = ["Syrup", "Oil", "Capsule", "Tablet", "Resin"];

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHerbs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/herbs");
      setHerbs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchHerbs();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", {
        name,
        category,
        baseQuantity,
        baseUnit,
        formula,
      });
      setName("");
      setCategory("");
      setBaseQuantity("");
      setBaseUnit("");
      setFormula([{ herbId: "", qty: 0, unit: "" }]);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditData({
      ...product,
      formula: product.formula.map((f) => ({
        herbId: f.herbId?._id || f.herbId || f.herb?._id || "",
        qty: f.qty,
        unit: f.unit,
      })),
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${editId}`, editData);
      setEditId(null);
      setEditData(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormulaChange = (index, field, value, isEdit = false) => {
    if (isEdit) {
      const newFormula = [...editData.formula];
      newFormula[index][field] = value;
      setEditData({ ...editData, formula: newFormula });
    } else {
      const newFormula = [...formula];
      newFormula[index][field] = value;
      setFormula(newFormula);
    }
  };

  const addFormulaRow = (isEdit = false) => {
    if (isEdit) {
      setEditData({
        ...editData,
        formula: [...editData.formula, { herbId: "", qty: 0, unit: "" }],
      });
    } else {
      setFormula([...formula, { herbId: "", qty: 0, unit: "" }]);
    }
  };

  const removeFormulaRow = (index, isEdit = false) => {
    if (isEdit) {
      const newFormula = editData.formula.filter((_, i) => i !== index);
      setEditData({ ...editData, formula: newFormula });
    } else {
      const newFormula = formula.filter((_, i) => i !== index);
      setFormula(newFormula);
    }
  };

  return (
    <div className="products-glass-bg">
      <div className="products-header">
        <span className="products-header-icon">🧪🌿</span>
        <h2 className="products-title">Product Management</h2>
      </div>
      {/* Add Product */}
      <form onSubmit={addProduct} className="products-form glass-card">
        <div className="form-row">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="products-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="products-input"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Base Quantity"
            value={baseQuantity}
            onChange={(e) => setBaseQuantity(e.target.value)}
            required
            className="products-input"
          />
          <select
            value={baseUnit}
            onChange={(e) => setBaseUnit(e.target.value)}
            required
            className="products-input"
          >
            <option value="">Select Base Unit</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <h3 className="products-subtitle">Formula</h3>
        {formula.map((f, index) => (
          <div key={index} className="formula-row animate-fade">
            <select
              value={f.herbId}
              onChange={(e) => handleFormulaChange(index, "herbId", e.target.value)}
              className="products-input"
            >
              <option value="">Select Herb</option>
              {herbs.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Qty"
              value={f.qty}
              onChange={(e) => handleFormulaChange(index, "qty", e.target.value)}
              className="products-input"
            />
            <select
              value={f.unit}
              onChange={(e) => handleFormulaChange(index, "unit", e.target.value)}
              className="products-input"
            >
              <option value="">Select Unit</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeFormulaRow(index)}
              className="products-btn remove-btn"
            >
              ❌
            </button>
          </div>
        ))}
        <div className="form-actions">
          <button type="button" onClick={() => addFormulaRow()} className="products-btn add-row-btn">
            ➕ Add Herb
          </button>
          <button type="submit" className="products-btn submit-btn">
            ✅ Add Product
          </button>
        </div>
      </form>

      {/* Edit Product */}
      {editId && (
        <form onSubmit={updateProduct} className="products-form glass-card">
          <h3 className="products-subtitle">Edit Product</h3>
          <div className="form-row">
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              required
              className="products-input"
            />
            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({ ...editData, category: e.target.value })
              }
              required
              className="products-input"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={editData.baseQuantity}
              onChange={(e) =>
                setEditData({ ...editData, baseQuantity: e.target.value })
              }
              required
              className="products-input"
            />
            <select
              value={editData.baseUnit}
              onChange={(e) =>
                setEditData({ ...editData, baseUnit: e.target.value })
              }
              required
              className="products-input"
            >
              <option value="">Select Base Unit</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <h3 className="products-subtitle">Formula</h3>
          {editData.formula.map((f, index) => (
            <div key={index} className="formula-row animate-fade">
              <select
                value={f.herbId}
                onChange={(e) =>
                  handleFormulaChange(index, "herbId", e.target.value, true)
                }
                className="products-input"
              >
                <option value="">Select Herb</option>
                {herbs.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={f.qty}
                onChange={(e) =>
                  handleFormulaChange(index, "qty", e.target.value, true)
                }
                className="products-input"
              />
              <select
                value={f.unit}
                onChange={(e) =>
                  handleFormulaChange(index, "unit", e.target.value, true)
                }
                className="products-input"
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeFormulaRow(index, true)}
                className="products-btn remove-btn"
              >
                ❌
              </button>
            </div>
          ))}
          <div className="form-actions">
            <button type="button" onClick={() => addFormulaRow(true)} className="products-btn add-row-btn">
              ➕ Add Herb
            </button>
            <button type="submit" className="products-btn submit-btn">
              ✏️ Update Product
            </button>
          </div>
        </form>
      )}

      {/* Product List */}
      <h3 className="products-subtitle" style={{ marginTop: "24px" }}>All Products</h3>
      <div className="products-table-wrapper animate-table">
        <table className="products-table glass-card">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Base Quantity</th>
              <th>Base Unit</th>
              <th>Formula</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="table-row-animate">
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.baseQuantity}</td>
                <td>{p.baseUnit}</td>
                <td>
                  <ul className="formula-list">
                    {p.formula.map((f) => {
                      const herbName =
                        herbs.find((h) => h._id === f.herbId)?.name ||
                        f.herb?.name;
                      return (
                        <li
                          key={f._id}
                          className={f.qty === 0 ? "formula-item formula-zero" : "formula-item"}
                        >
                          🌱 {herbName} - {f.qty} {f.unit}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>
                  <button onClick={() => startEdit(p)} className="products-btn edit-btn">✏️</button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="products-btn delete-btn"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;