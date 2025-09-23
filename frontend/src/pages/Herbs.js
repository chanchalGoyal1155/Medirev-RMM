import React, { useState, useEffect } from "react";
import axios from "axios";

const Herbs = () => {
  const [herbs, setHerbs] = useState([]);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const units = ["g", "ml", "kg", "l"]; // suggestions

  // Fetch all herbs
  const fetchHerbs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/herbs");
      setHerbs(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch herbs");
    }
  };

  useEffect(() => {
    fetchHerbs();
  }, []);

  // Add new herb
  const handleAddHerb = async (e) => {
    e.preventDefault();
    if (!name || !unit) return setError("Name & Unit required");
    try {
      await axios.post("http://localhost:5000/api/herbs", { name, unit });
      setName("");
      setUnit("");
      setError("");
      fetchHerbs();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Error adding herb");
    }
  };

  // Start editing
  const startEdit = (herb) => {
    setEditId(herb._id);
    setEditName(herb.name);
    setEditUnit(herb.unit);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditUnit("");
  };

  // Save edited herb
  const saveEdit = async () => {
    if (!editName || !editUnit) return setError("Name & Unit required");
    try {
      await axios.put(`http://localhost:5000/api/herbs/${editId}`, {
        name: editName,
        unit: editUnit,
      });
      cancelEdit();
      setError("");
      fetchHerbs();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Error updating herb");
    }
  };

  // Delete herb
  const deleteHerb = async (id) => {
    if (!window.confirm("Are you sure you want to delete this herb?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/herbs/${id}`);
      fetchHerbs();
    } catch (err) {
      console.log(err);
      setError("Error deleting herb");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Herb Management</h1>

      <form onSubmit={handleAddHerb} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Herb Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          list="unit-suggestions"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <datalist id="unit-suggestions">
          {units.map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>
        <button type="submit">Add Herb</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>All Herbs</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {herbs.map((herb) => (
            <tr key={herb._id}>
              <td>
                {editId === herb._id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  herb.name
                )}
              </td>
              <td>
                {editId === herb._id ? (
                  <input
                    list="unit-suggestions"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                  />
                ) : (
                  herb.unit
                )}
              </td>
              <td>
                {editId === herb._id ? (
                  <>
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(herb)}>Edit</button>
                    <button onClick={() => deleteHerb(herb._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Herbs;
