import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import './Login.css';


export default function Login (){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(email, password); // Debugging line

    try{
      const response = await axios.post("/api/auth/login-user", { email, password});

      if (response.data.success) {
        toast.success(response.data.message || "Login Successful");

        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login Failed");
      }
    }catch(err){
      console.error("Error During Login:", err.response?.data);
      toast.error(err.response?.data?.message || "Something Went Wrong @ login frnt");

    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FontAwesomeIcon icon={faGraduationCap} className="logo-icon" />
          <h3 className='welcome'>Welcome to</h3>
          <h1 className="main-title">
            Rate-My-ISSE
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              onChange={(e) => { setEmail(e.target.value )}}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => { setPassword(e.target.value )}}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        
        
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: CHU Mingzuo</p>
          <p>Password: 020418</p>
        </div>
      </div>
    </div>
  );
};
