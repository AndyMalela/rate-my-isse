import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import './TopBar.css';

const TopBar = ({ user, onLogout, onMenuToggle }) => {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="page-title">Student Dashboard</h1>
      </div>
      
      <div className="top-bar-right">
        <div className="user-info">
          <span className="user-name">{user?.username || 'Student'}</span>
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 