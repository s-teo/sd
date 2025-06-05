import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-logo">
          🩺 MedBooking
        </div>

        <div className="footer-links">
          <Link to="/" className="footer-link">Главная</Link>
          <Link to="/doctors" className="footer-link">Специалисты</Link>
          <Link to="/about" className="footer-link">О нас</Link>
          <Link to="/contact" className="footer-link">Контакты</Link>
        </div>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} MedBooking. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
