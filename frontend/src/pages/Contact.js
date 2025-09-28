// src/pages/Contact.js
import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">📞 Contact Us</h1>

      <p className="contact-intro">
        Have questions, suggestions, or feedback? We'd love to hear from you!
      </p>

      <div className="contact-sections">
        {/* Left section – Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>

        {/* Right section – Info */}
        <div className="contact-info">
          <h2>📍 Our Office</h2>
          <p>Medirev Herbal Pvt. Ltd.<br />Jaipur, Rajasthan 302001</p>

          <h2>📧 Email</h2>
          <p>support@medirev.com</p>

          <h2>📱 Phone</h2>
          <p>+91 98765 43210</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
