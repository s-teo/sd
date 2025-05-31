import { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, logout as logoutApi, getProfile, refreshToken } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    await fetchUser();
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    
  };

  const fetchUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch {
      try {
        const res = await refreshToken();
        localStorage.setItem("access", res.data.access);
        const profileRes = await getProfile();
        setUser(profileRes.data);
      } catch {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Добавь это:
export { AuthContext };
