import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import SignUp from './components/SignUp';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.log('No existing session found');
      }
    };
    
    checkAuth();
  }, []);

  console.log('AppContent - user state:', user); // Debug log

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Login setUser={setUser} />
        } 
      />
      <Route
      path='/signup'
      element ={
        <SignUp setUser={setUser} />
      }
      />
      <Route 
        path="/dashboard/*" 
        element={
          <Dashboard user={user} onLogout={handleLogout} />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App; 