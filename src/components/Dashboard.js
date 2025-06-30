import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FindProfessor from './pages/FindProfessor';
import FindCourse from './pages/FindCourse';
import ProfessorDetail from './pages/ProfessorDetail';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        currentPath={location.pathname}
      />
      <div className="main-content">
        <TopBar 
          user={user} 
          onLogout={onLogout}
          onMenuToggle={toggleSidebar}
        />
        <div className="content-area">
          <Routes>
            <Route path="/find-professor" element={<FindProfessor />} />
            <Route path="/find-course" element={<FindCourse />} />
            <Route path="/professor/:name" element={<ProfessorDetail />} />
            <Route path="/course/:code" element={<CourseDetail />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 