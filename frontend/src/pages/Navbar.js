// src/components/Navbar.js
import React from "react";
import "./Navbar.css";

function Navbar({ setPage, currentPage }) {
  return (
    <nav className="navbar">
      <div className="logo">Medirev RRM</div>
      <div className="nav-links">
        <button
          className={currentPage === "herbs" ? "active" : ""}
          onClick={() => setPage("herbs")}
        >
          Herbs
        </button>
        <button
          className={currentPage === "products" ? "active" : ""}
          onClick={() => setPage("products")}
        >
          Products
        </button>
        <button
          className={currentPage === "calc" ? "active" : ""}
          onClick={() => setPage("calc")}
        >
          Calculation
        </button>
        <button
          className={currentPage === "about" ? "active" : ""}
          onClick={() => setPage("about")}
        >
          About
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
