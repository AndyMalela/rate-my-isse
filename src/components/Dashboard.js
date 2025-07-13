import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import FindProfessor from './pages/FindProfessor';
import FindCourse from './pages/FindCourse';
import ProfessorDetail from './pages/ProfessorDetail';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import RateProfessor from './pages/rate-professor';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentRatings, setRecentRatings] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentRatings = async () => {
      try {
        const res = await axios.get('/api/ratings/recent');
        setRecentRatings(res.data);
      } catch (err) {
        console.error('Failed to fetch recent ratings:', err);
      }
    };
    fetchRecentRatings();
  }, []);

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
                    onClick={() => navigate('rate-professor')}
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('rate-professor'); }}
                  >
                    <h3>Rate Courses</h3>
                    <p>You can Rate quickly!</p>
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

                <div className="recent-ratings-section">
                  <h2>Recent Ratings</h2>
                  {recentRatings.length === 0 ? (
                    <p>No recent ratings found.</p>
                  ) : (
                    recentRatings.map(rating => (
                      <div
                        key={rating.id}
                        className="rating-card clickable"
                        onClick={() => navigate(`/dashboard/course/${rating.course_id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigate(`/dashboard/course/${rating.course_id}`);
                          }
                        }}
                        style={{
                          border: '1px solid #ddd',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '16px',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <div className="rating-header" style={{ marginBottom: '12px' }}>
                          <h4 className="course-name" style={{ margin: 0, fontSize: '18px', color: '#2d3436' }}>
                            📘 {rating.course_name}
                          </h4>
                          <p className="professor-name" style={{ margin: '4px 0 0', color: '#636e72' }}>
                            Professor: {rating.professor_name}
                          </p>
                        </div>

                        <div className="rating-stars" style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                          <div>
                            <strong>Prof Rating:</strong>{' '}
                            {'★'.repeat(rating.rating_professor)}{'☆'.repeat(5 - rating.rating_professor)}
                          </div>
                          <div>
                            <strong>Hardness:</strong>{' '}
                            {'★'.repeat(rating.rating_hardness)}{'☆'.repeat(5 - rating.rating_hardness)}
                          </div>
                        </div>

                        {rating.review_text && (
                          <div className="rating-review" style={{ fontStyle: 'italic', color: '#2d3436' }}>
                            <p>“{rating.review_text}”</p>
                          </div>
                        )}

                        <div className="rating-footer" style={{ marginTop: '10px', fontSize: '0.85rem', color: '#b2bec3' }}>
                          Submitted on {new Date(rating.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            } />
            <Route path="find-professor" element={<FindProfessor />} />
            <Route path="find-course" element={<FindCourse />} />
            <Route path="professor/:name" element={<ProfessorDetail />} />
            <Route path="course/:code" element={<CourseDetail user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="rate-professor" element={<RateProfessor />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
