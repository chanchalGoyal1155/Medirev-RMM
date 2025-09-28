// src/pages/About.js
import React from "react";
import "./About.css"; // separate CSS file import

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Medirev Raw Material Management (RRM)</h1>

      <section className="about-section">
        <h2>🌿 About RRM System</h2>
        <p>
          The Raw Material Management (RRM) system helps track and manage herbs, 
          products, and production calculations in a simple and efficient way. 
          It ensures accurate material usage and stock balance for every product manufactured.
        </p>
      </section>

      <section className="about-section">
        <h2>🏥 About Medirev</h2>
        <p>
          Medirev is a herbal and wellness brand dedicated to providing natural and effective 
          healthcare solutions. With a strong focus on purity and innovation, Medirev ensures 
          that every product meets the highest quality standards.
        </p>
      </section>

      <section className="about-section">
        <h2>✨ Our Vision</h2>
        <p>
          To revolutionize the herbal industry through technology-driven manufacturing management, 
          transparency, and sustainable growth.
        </p>
      </section>
    </div>
  );
};

export default About;
