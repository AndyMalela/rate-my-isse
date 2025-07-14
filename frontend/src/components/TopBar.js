import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

const TopBar = ({ user, onLogout, onMenuToggle }) => {
  const navigate = useNavigate();
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Open sidebar menu">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <button
          className="dashboard-home-btn"
          onClick={() => navigate('/dashboard')}
          aria-label="Go to Dashboard"
          tabIndex={0}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
        <h1 className="page-title">Student Dashboard</h1>
      </div>
      <div className="top-bar-right">
        <div className="user-info">
          <span className="user-name">{user?.name || user?.username || 'Student'}</span>
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          {onLogout && (
            <button className="logout-btn" onClick={onLogout} aria-label="Logout">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar; 