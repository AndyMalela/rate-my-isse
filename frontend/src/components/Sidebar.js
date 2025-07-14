import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, currentPath }) => {
  const navItems = [
    { path: '/dashboard/find-professor', icon: faSearch, label: 'Find my Professor' },
    { path: '/dashboard/find-course', icon: faBook, label: 'Find my Course' },
    { path: '/dashboard/profile', icon: faUser, label: 'My Profile' }
  ];

  return (
    <nav className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h2>Rating System</h2>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => onToggle()}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar; 