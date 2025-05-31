import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/main.css"; // если нужно локально

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MediBook</Link>
      </div>
      <nav className="nav">
        {user ? (
          <>
            <Link to="/appointments">Мои записи</Link>
            <Link to="/profile">Профиль</Link>
            <button onClick={logout} className="logout-button">Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
}
