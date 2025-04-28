import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5050/auth/login", {
        email,
        password
      }, {
        withCredentials: true 
      });
      
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5050/auth/logout", {}, {
        withCredentials: true
      });
      
      setAccessToken(null);
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:5050/auth/refresh", {
        withCredentials: true
      });
      
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      return false;
    }
  };

  // Create axios instance with authorization header
  const authAxios = axios.create();
  
  // Add token to all requests
  authAxios.interceptors.request.use(
    config => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Handle token expiration
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshed = await refreshToken();
        if (refreshed) {
          // Update token and retry
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return authAxios(originalRequest);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      login, 
      logout,
      authAxios
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};