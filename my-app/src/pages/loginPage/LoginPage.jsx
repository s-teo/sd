import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // проверь, корректен ли путь
import { useLocation } from "react-router-dom";
import "./LoginPage.css";

const Login = () => {
  const { login } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Flash сообщение
  const [flashMessage, setFlashMessage] = useState(location.state?.flash || null);
  const [showFlash, setShowFlash] = useState(!!location.state?.flash);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setShowFlash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      window.location.href = "/";
    } catch {
      setError("Неверное имя пользователя или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {showFlash && (
        <div className="flash-message">
          {flashMessage}
          <button className="close-btn" onClick={() => setShowFlash(false)}>×</button>
        </div>
      )}

      <h2>Вход</h2>
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <label htmlFor="username">
          Имя пользователя
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder="Введите имя пользователя"
          />
        </label>

        <label htmlFor="password">
          Пароль
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Введите пароль"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default Login;
