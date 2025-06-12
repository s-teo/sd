import React, { useState } from "react"; // Добавил useState
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Состояние для мобильного меню

  // Функция для переключения состояния мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Функция для закрытия мобильного меню (при клике на ссылку)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          🩺 MedBooking
        </Link>

        {/* Бургер-кнопка для мобильных устройств */}
        <button
          className={`menu-toggle ${isMobileMenuOpen ? "active" : ""}`} // Добавил класс active для анимации
          onClick={toggleMobileMenu}
          aria-label="Открыть/Закрыть меню"
        >
          <span className="burger-icon"></span>
        </button>

        <nav className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
          {" "}
          {user ? (
            <>
              {" "}
              <span className="welcome">Здравствуйте, {user.username}</span>
            </>
          ) : (
            <></>
          )}
          {/* Добавил класс open */}
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>
            Главная
          </Link>{" "}
          {/* Изменил className с "nav" на "nav-link" для стилей */}
          <Link to="/doctors" className="nav-link" onClick={closeMobileMenu}>
            Специалисты
          </Link>{" "}
          {/* Изменил className */}
          
          {user ? (
            <>
              {user.is_doctor && (
                <Link
                  to="/doctor/appoinmetns"
                  className="nav-link"
                  onClick={closeMobileMenu}
                >
                  {" "}
                  {/* Изменил className */}
                  Мои Сессии
                </Link>
              )}
              <Link
                to="/messages"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                {" "}
                {/* Изменил className */}
                Консультации
              </Link>
              <Link
                to="/profile"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                Профиль
              </Link>{" "}
              {/* Изменил className */}
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="logout-button"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-button"
                onClick={closeMobileMenu}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="nav-button"
                onClick={closeMobileMenu}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
