import React from "react";
import "./About.css"; // normal import

const About = () => {
  return (
    <div className="aboutpage-container">
      <h1 className="aboutpage-title">
        <span role="img" aria-label="herbal">🌱</span> About Medirev Raw Material Management (RRM)
      </h1>

      <section className="aboutpage-section aboutpage-card">
        <div className="aboutpage-icon-circle">🌿</div>
        <h2>About RRM System</h2>
        <p>
          The Raw Material Management (RRM) system empowers Medirev to track and manage precious herbs,
          ayurvedic ingredients, and production calculations. It ensures accurate material usage and 
          optimal stock balance for every batch of our natural medicines.
        </p>
      </section>

      <section className="aboutpage-section aboutpage-card">
        <div className="aboutpage-icon-circle">🏥</div>
        <h2>About Medirev</h2>
        <p>
          Medirev is a trusted ayurvedic wellness brand, blending ancient wisdom with modern science.
          Every product is crafted with purity, transparency, and a commitment to holistic healthcare.
          Our plant-based medicines uphold the highest quality standards for your well-being.
        </p>
      </section>

      <section className="aboutpage-section aboutpage-card">
        <div className="aboutpage-icon-circle">✨</div>
        <h2>Our Vision</h2>
        <p>
          To revolutionize herbal medicine manufacturing with technology, sustainability, and complete transparency—
          nurturing health, nature, and society.
        </p>
      </section>
    </div>
  );
};

export default About;