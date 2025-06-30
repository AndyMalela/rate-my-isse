import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faEnvelope, faPhone, faGraduationCap, faCalendar } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

const Profile = ({ user }) => {
  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <button className="btn-primary">Edit Profile</button>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          
          <div className="profile-info">
            <h3>{user?.username || 'CHU Mingzuo'}</h3>
            <p>
              <FontAwesomeIcon icon={faIdCard} />
              Student ID: 2024001
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} />
              mingzuo.chu@student.edu
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} />
              +1 234 567 8900
            </p>
            <p>
              <FontAwesomeIcon icon={faGraduationCap} />
              Major: Information Systems and Software Engineering
            </p>
            <p>
              <FontAwesomeIcon icon={faCalendar} />
              Enrollment Year: 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 