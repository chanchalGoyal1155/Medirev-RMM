import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-hero-bg">
      <div className="home-glass-card">
        <div className="home-logo-anim">🌱</div>
        <h1 className="home-title-anim">
          Welcome to <span className="brand-color">Medirev</span> Raw Material Management System
        </h1>
        <p className="home-subtitle-anim">
          Streamline your raw material tracking, product formulation, and stock calculation — all in one place.
        </p>
        <div className="home-highlight-anim">
          <p>
            Empowering <span className="brand-color">Medirev</span> to manage herbs, products, and formulations efficiently
            with complete transparency and precision.
          </p>
        </div>
        <div className="home-ayur-leaves">
          <span role="img" aria-label="leaf">🍃</span>
          <span role="img" aria-label="leaf">🍃</span>
          <span role="img" aria-label="leaf">🍃</span>
        </div>
      </div>
    </div>
  );
}

export default Home;