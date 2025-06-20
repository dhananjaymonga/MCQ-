import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a UserContext with default value of null
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check if there's a user in localStorage or sessionStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // If user exists, set it
    } else {
      // If no user in localStorage, try to fetch from server
      const fetchUser = async () => {
        try {
          const res = await axios.get('http://localhost:5000/auth/me', { withCredentials: true });
          setUser(res.data.user); // If user exists on the server, set it
          localStorage.setItem('user', JSON.stringify(res.data.user)); // Store it in localStorage
        } catch (err) {
          setUser(null);
          console.log('❌ No user or invalid token');
        }
      };
      fetchUser();
    }
  }, []); // Empty dependency array to run only once on mount

  const handleLogin = (userData) => {
    setUser(userData); // Set user when logged in
    console.log("✅ User fetched from backend:", res.data.user);

    localStorage.setItem('user', JSON.stringify(userData)); // Store user in localStorage
    console.log(user)
  };

  const handleLogout = () => {
    setUser(null); // Clear user on logout
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
