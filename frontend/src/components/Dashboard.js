import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  console.log('Dashboard rendering with user:', user);
  console.log('Current location:', location.pathname);

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
            <Route path="" element={
              <div className="welcome-dashboard">
                <h1 className="dashboard-welcome-message">
                  Welcome to Rate My ISSE!
                </h1>
                <p className="dashboard-welcome-desc">
                  Start by searching for a professor or searching by course names to start reviewing.
                </p>
                <div className="dashboard-stats">
                  <div
                    className="stat-card dashboard-btn"
                    onClick={() => navigate('find-professor')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('find-professor'); }}
                  >
                    <h3>Find Professors</h3>
                    <p>Search and rate professors</p>
                  </div>
                  <div
                    className="stat-card dashboard-btn"
                    onClick={() => navigate('find-course')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('find-course'); }}
                  >
                    <h3>Find Courses</h3>
                    <p>Discover and review courses</p>
                  </div>
                  <div
                    className="stat-card dashboard-btn"
                    onClick={() => navigate('profile')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('profile'); }}
                  >
                    <h3>Your Profile</h3>
                    <p>Manage your account</p>
                  </div>
                </div>
              </div>
            } />
            <Route path="find-professor" element={<FindProfessor />} />
            <Route path="find-course" element={<FindCourse />} />
            <Route path="professor/:name" element={<ProfessorDetail />} />
            <Route path="course/:code" element={<CourseDetail user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 