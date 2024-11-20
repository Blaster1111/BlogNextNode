import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set the Authorization header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      router.push("/login");
    }
  }, [router]);

  const login = (token: string) => {
    // Store the token in localStorage
    localStorage.setItem("token", token);
    
    // Set the Authorization header for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setAuthenticated(true);
    router.push("/dashboard");
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    
    // Remove the Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setAuthenticated(false);
    router.push("/login");
  };

  return { authenticated, login, logout };
};