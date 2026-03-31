import { createContext, useState, useEffect } from "react";
import { getUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkUser();
  }, []); //calls /me on every refresh

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
