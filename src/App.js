import React, { useState, useEffect } from "react";
import SignupForm from "./components/SignupForm/SignupForm";
import LoginForm from "./components/LoginForm/LoginForm";
import HabitTracker from "./components/HabitTracker/HabitTracker";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (email, password) => {
    const storedUser = localStorage.getItem(`user_${email}`);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.password === password) {
        setUser({ email });
        localStorage.setItem("user", JSON.stringify({ email }));
        alert("Login Successful");
      } else {
        alert("Invalid credentials");
      }
    } else {
      alert("User not found");
    }
  };

  const handleSignup = (email, password) => {
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      alert("An account with this email already exists");
      return;
    }

    const newUser = { email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    setUser({ email });
    localStorage.setItem("user", JSON.stringify({ email }));
    alert("Signup Successful");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert("Logged Out");
  };

  return (
    <div className="app">
      {user ? (
        <HabitTracker user={user} onLogout={handleLogout} />
      ) : isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onToggleForm={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onToggleForm={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}

export default App;
