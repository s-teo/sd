import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          🩺 MedBooking
        </Link>

        <nav className="nav">
          <Link to="/" className="nav">Главная</Link>
          <Link to="/doctors" className="nav">Специалисты</Link>

          {user ? (
            <>
              <span className="welcome">Здравствуйте, {user.username}</span>
              <Link to="/profile" className="nav">Профиль</Link>
              <button onClick={logout} className="logout-button">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">Войти</Link>
              <Link to="/register" className="nav-button">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
