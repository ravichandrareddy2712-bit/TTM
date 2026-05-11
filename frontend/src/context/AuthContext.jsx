import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, signupUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    const token = localStorage.getItem("ttm_token");
    if (!token) return setLoading(false);
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("ttm_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    localStorage.setItem("ttm_token", data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const data = await signupUser(payload);
    localStorage.setItem("ttm_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
