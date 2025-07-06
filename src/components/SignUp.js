import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import './SignUp.css';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    console.log(email, username, password);

    try {
      const response = await axios.post("/api/auth/register-user", { email, username, password, confirmPassword });

      if (response.data.success) {
        toast.success(response.data.message || "Registration Successful! Please log in.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Registration Failed");
      }
    } catch (err) {
      console.error("Error During Registration:", err.response?.data);
      toast.error(err.response?.data?.message || "Something Went Wrong @ signup frnt");
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <FontAwesomeIcon icon={faGraduationCap} className="logo-icon" />
          <h3 className='welcome'>Join</h3>
          <h1 className="main-title">
            Rate-My-ISSE
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              onChange={(e) => { setEmail(e.target.value) }}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              onChange={(e) => { setUsername(e.target.value) }}
              required
              placeholder="Create a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => { setPassword(e.target.value) }}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              onChange={(e) => { setConfirmPassword(e.target.value) }}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="login-link-section">
          <p>Already have an account? <span onClick={() => navigate("/")}>Log In</span></p>
        </div>
      </div>
    </div>
  );
};