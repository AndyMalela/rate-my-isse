import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faEnvelope, faPhone, faGraduationCap, faCalendar, faBook } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import StarRating from '../StarRating';
import './Profile.css';

const Profile = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    const fetchUserReviews = async () => {
      console.log('Profile component - user object:', user); // Debug log
      
      if (!user || !user.id) {
        console.log('No user or user.id found, skipping review fetch'); // Debug log
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching reviews for user ID:', user.id); // Debug log
        const response = await axios.get(`${API_BASE}/api/ratings/user/${user.id}`);
        console.log('Reviews response:', response.data); // Debug log
        setReviews(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err); // Debug log
        setError('Failed to load your reviews');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [API_BASE, user]);

  const formatFeatureName = (name) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleReviewClick = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setNewName(user?.name || '');
    setProfileMsg(null);
  };
  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileMsg(null);
  };
  const handleSaveName = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      await axios.put(`${API_BASE}/api/auth/user/${user.id}`, { name: newName });
      setProfileMsg('Name updated!');
      setEditMode(false);
      // Optionally, reload the page or update user state if available
      window.location.reload();
    } catch (err) {
      setProfileMsg('Failed to update name.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        {!editMode && (
          <button className="btn-primary" onClick={handleEditProfile}>Edit Profile</button>
        )}
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
          
          <div className="profile-info">
            {editMode ? (
              <form className="edit-name-form" onSubmit={handleSaveName} style={{marginBottom:16}}>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="edit-name-input"
                  disabled={saving}
                  maxLength={32}
                  style={{fontSize:'1.2rem',padding:'8px',borderRadius:'6px',border:'1.5px solid #d63031',marginBottom:8}}
                />
                <div style={{display:'flex',gap:8}}>
                  <button type="submit" className="btn-primary" disabled={saving} style={{minWidth:90}}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={saving} style={{minWidth:90}}>
                    Cancel
                  </button>
                </div>
                {profileMsg && <div style={{marginTop:8,color:profileMsg.includes('Fail')?'#d63031':'green'}}>{profileMsg}</div>}
              </form>
            ) : (
              <h3 style={{marginBottom:8}}>{user?.name || user?.username || 'CHU Mingzuo'}</h3>
            )}
            <p>
              <FontAwesomeIcon icon={faIdCard} />
              Student ID: {user?.id || '2024001'}
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} />
              {user?.email || 'mingzuo.chu@student.edu'}
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

        <div className="my-reviews-section">
          <h2>My Reviews</h2>
          {loading ? (
            <p>Loading your reviews...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : reviews.length === 0 ? (
            <p>You haven't posted any reviews yet.</p>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="review-card"
                  onClick={() => handleReviewClick(review.course_id)}
                >
                  <div className="review-header">
                    <h3 className="course-name">
                      <FontAwesomeIcon icon={faBook} style={{ marginRight: 8, color: '#d63031' }} />
                      {review.course_name}
                    </h3>
                    <span className="professor-name">{review.professor_name}</span>
                  </div>
                  
                  <div className="review-ratings">
                    <div className="rating-item">
                      <span className="rating-label">Professor:</span>
                      <StarRating value={review.rating_professor} readOnly size={16} />
                    </div>
                    <div className="rating-item">
                      <span className="rating-label">Hardness:</span>
                      <StarRating value={review.rating_hardness} readOnly size={16} />
                    </div>
                  </div>
                  
                  {review.features && (
                    <div className="review-features">
                      <span className="features-label">Features:</span>
                      <span className="features-list">
                        {review.features.split(',').map(feature => 
                          formatFeatureName(feature.trim())
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {review.review_text && (
                    <div className="review-text">
                      <p>{review.review_text}</p>
                    </div>
                  )}
                  
                  <div className="review-footer">
                    <span className="review-author">By {review.user_name}</span>
                    <span className="click-hint">Click to view course</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 