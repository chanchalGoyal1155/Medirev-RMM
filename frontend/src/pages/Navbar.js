import React from "react";
import "./Navbar.css";

function Navbar({ setPage, currentPage }) {
    return (
        <nav className="navbar-herbal">
            <div className="navbar-logo">
                <span role="img" aria-label="herbal">🌿</span> Medirev RMM
            </div>
            <div className="navbar-links">
                <button
                    className={currentPage === "home" ? "active" : ""}
                    onClick={() => setPage("home")}
                >
                    Home
                </button>

                <button
                    className={currentPage === "herbs" ? "navbar-active" : ""}
                    onClick={() => setPage("herbs")}
                >
                    Herbs
                </button>
                <button
                    className={currentPage === "products" ? "navbar-active" : ""}
                    onClick={() => setPage("products")}
                >
                    Products
                </button>
                <button
                    className={currentPage === "calc" ? "navbar-active" : ""}
                    onClick={() => setPage("calc")}
                >
                    Calculation
                </button>
                <button
                    className={currentPage === "about" ? "navbar-active" : ""}
                    onClick={() => setPage("about")}
                >
                    About
                </button>
                <button onClick={() => setPage("blogs")} style={{ marginRight: "10px" }}>Blogs</button>
            </div>
        </nav>
    );
}

export default Navbar;