import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Herbs.css"; // Add this import

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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/herbs`);
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/herbs`, { name, unit });
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
      await axios.put(`${process.env.REACT_APP_API_URL}/api/herbs/${editId}`, {
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/herbs/${id}`);
      fetchHerbs();
    } catch (err) {
      console.log(err);
      setError("Error deleting herb");
    }
  };

  return (
    <div className="herbs-container">
      <h1 className="herbs-title">🌿 Herb Management</h1>

      <form onSubmit={handleAddHerb} className="herbs-form">
        <input
          type="text"
          placeholder="Herb Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="herbs-input"
        />
        <input
          list="unit-suggestions"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="herbs-input"
        />
        <datalist id="unit-suggestions">
          {units.map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>
        <button type="submit" className="herbs-btn herbs-add-btn">Add Herb</button>
      </form>

      {error && <p className="herbs-error">{error}</p>}

      <h2 className="herbs-subtitle">All Herbs</h2>
      <div className="herbs-table-wrapper">
        <table className="herbs-table">
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
                      className="herbs-input"
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
                      className="herbs-input"
                    />
                  ) : (
                    herb.unit
                  )}
                </td>
                <td>
                  {editId === herb._id ? (
                    <>
                      <button className="herbs-btn herbs-save-btn" onClick={saveEdit}>Save</button>
                      <button className="herbs-btn herbs-cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="herbs-btn herbs-edit-btn" onClick={() => startEdit(herb)}>Edit</button>
                      <button className="herbs-btn herbs-delete-btn" onClick={() => deleteHerb(herb._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Herbs;