import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import SignUp from './components/SignUp';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <Login/>
            } 
          />
          <Route
          path='/signup'
          element ={
            <SignUp/>
          }
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard/>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 