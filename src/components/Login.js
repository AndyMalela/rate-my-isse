import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Valid users data
  const validUsers = [
    {
      username: "CHU Mingzuo",
      password: "020418",
      role: "student"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { username, password } = formData;
    
    // Clear previous message
    setMessage('');
    setMessageType('');

    // Validate user input
    const user = validUsers.find(u => 
      u.username === username.trim() && u.password === password
    );

    if (user) {
      // Login successful
      setMessage('Login successful! Redirecting to student dashboard...');
      setMessageType('success');
      
      // Save user info and trigger login
      const userData = {
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString()
      };
      
      setTimeout(() => {
        onLogin(userData);
      }, 1500);
      
    } else {
      // Login failed
      setMessage('Invalid username or password. Please try again.');
      setMessageType('error');
      
      // Clear password field
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FontAwesomeIcon icon={faGraduationCap} className="logo-icon" />
          <h1 className="main-title">
            Welcome to ISSE Courses Professors Reviewing System
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: CHU Mingzuo</p>
          <p>Password: 020418</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 