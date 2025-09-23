import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // ✅ NEW: categories dropdown options
  const categoryOptions = ["Syrup", "Oil", "Capsule", "Tablet"];

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch herbs
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

  // Add product
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

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing
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

  // Update product
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

  // Formula handling
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
    <div>
      <h2>Product Management</h2>
      {/* Add Product */}
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* ✅ UPDATED: Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
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
        />
        <select
          value={baseUnit}
          onChange={(e) => setBaseUnit(e.target.value)}
          required
        >
          <option value="">Select Base Unit</option>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <h3>Formula</h3>
        {formula.map((f, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            <select
              value={f.herbId}
              onChange={(e) => handleFormulaChange(index, "herbId", e.target.value)}
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
              style={{ marginLeft: "5px", marginRight: "5px" }}
            />
            <select
              value={f.unit}
              onChange={(e) => handleFormulaChange(index, "unit", e.target.value)}
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
              style={{ marginLeft: "5px" }}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addFormulaRow()}>
          Add Herb to Formula
        </button>
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add Product
        </button>
      </form>

      {/* Edit Product */}
      {editId && (
        <form onSubmit={updateProduct} style={{ marginTop: "20px" }}>
          <h3>Edit Product</h3>
          <input
            type="text"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            required
          />
          {/* ✅ UPDATED: Edit category dropdown */}
          <select
            value={editData.category}
            onChange={(e) =>
              setEditData({ ...editData, category: e.target.value })
            }
            required
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
          />
          <select
            value={editData.baseUnit}
            onChange={(e) =>
              setEditData({ ...editData, baseUnit: e.target.value })
            }
            required
          >
            <option value="">Select Base Unit</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <h3>Formula</h3>
          {editData.formula.map((f, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <select
                value={f.herbId}
                onChange={(e) =>
                  handleFormulaChange(index, "herbId", e.target.value, true)
                }
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
                style={{ marginLeft: "5px", marginRight: "5px" }}
              />
              <select
                value={f.unit}
                onChange={(e) =>
                  handleFormulaChange(index, "unit", e.target.value, true)
                }
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
                style={{ marginLeft: "5px" }}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addFormulaRow(true)}>
            Add Herb to Formula
          </button>
          <button type="submit" style={{ marginLeft: "10px" }}>
            Update Product
          </button>
        </form>
      )}

      {/* Product List */}
      <h3 style={{ marginTop: "20px" }}>All Products</h3>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
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
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.baseQuantity}</td>
              <td>{p.baseUnit}</td>
              <td>
                <ul>
                  {p.formula.map((f) => {
                    const herbName =
                      herbs.find((h) => h._id === f.herbId)?.name ||
                      f.herb?.name;
                    return (
                      <li
                        key={f._id}
                        style={{
                          color: f.qty === 0 ? "grey" : "black",
                          fontStyle: f.qty === 0 ? "italic" : "normal",
                        }}
                      >
                        {herbName} - {f.qty} {f.unit}
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
