// src/pages/Home.js
import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Medirev Raw Material Management System</h1>
        <p className="home-subtitle">
          Streamline your raw material tracking, product formulation, and stock calculation — all in one place.
        </p>
        <div className="home-highlight">
          <p>
            Empowering Medirev to manage herbs, products, and formulations efficiently with
            complete transparency and precision.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
