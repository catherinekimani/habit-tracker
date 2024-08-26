import React, { useState } from "react";
import "./SignupForm.css";

function SignupForm({ onSignup, onToggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email, password);
  };

  return (
    <div className="container">
      <div className="card signup-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>
        <button onClick={onToggleForm} className="btn btn-secondary">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default SignupForm;
