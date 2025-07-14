import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfessorDetail.css';
import StarRating from '../StarRating';

const ProfessorDetail = () => {
  const { name: id } = useParams(); // 'name' param is now actually the professor ID
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        setLoading(true);
        const [professorRes, statsRes, reviewsRes] = await Promise.all([
          axios.get(`/api/professors/${id}`),
          axios.get(`/api/ratings/prof/${id}/stats`),
          axios.get(`/api/ratings/prof/${id}`)
        ]);
        setProfessor(professorRes.data);
        setStats(statsRes.data);
        setReviews(reviewsRes.data);
        setError(null);
      } catch (err) {
        setError('Professor not found');
        setProfessor(null);
        setStats(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessor();
  }, [id]);

  if (loading) return <div className="professor-detail-page"><h2>Loading...</h2></div>;
  if (error || !professor) return <div className="professor-detail-page"><h2>{error || 'Professor not found'}</h2></div>;

  return (
    <div className="professor-detail-page new-layout">
      <div className="professor-header">
        <h1 className="professor-name">{professor.name}</h1>
      </div>
      
      <div className="professor-content">
        {/* Left side - Statistics */}
        <div className="professor-stats-col">
          {stats && stats.total_reviews > 0 ? (
            <div className="professor-stats-section">
              <h2>Professor Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Average Professor Rating</div>
                  <div className="stat-value">
                    {stats.avg_professor_rating ? parseFloat(stats.avg_professor_rating).toFixed(1) : 'N/A'} / 5
                  </div>
                  <div className="stat-stars">
                    {stats.avg_professor_rating ? '★'.repeat(Math.round(parseFloat(stats.avg_professor_rating))) + '☆'.repeat(5 - Math.round(parseFloat(stats.avg_professor_rating))) : '☆☆☆☆☆'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Average Course Hardness</div>
                  <div className="stat-value">
                    {stats.avg_hardness_rating ? parseFloat(stats.avg_hardness_rating).toFixed(1) : 'N/A'} / 5
                  </div>
                  <div className="stat-stars">
                    {stats.avg_hardness_rating ? '★'.repeat(Math.round(parseFloat(stats.avg_hardness_rating))) + '☆'.repeat(5 - Math.round(parseFloat(stats.avg_hardness_rating))) : '☆☆☆☆☆'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Reviews</div>
                  <div className="stat-value">{stats.total_reviews}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="professor-stats-section no-reviews">
              <h2>Professor Statistics</h2>
              <p>No reviews yet for this professor.</p>
            </div>
          )}
        </div>
        
        {/* Right side - Courses */}
        <div className="professor-courses-col">
          <div className="courses-section">
            <h2>Courses Taught</h2>
            <div className="courses-grid">
              {professor.courses && professor.courses.length > 0 ? (
                professor.courses.map((course) => (
                  <div key={course.id} className="course-card">
                    <div
                      className="course-link"
                      onClick={() => navigate(`/dashboard/course/${course.id}`)}
                    >
                      {course.course_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses">
                  <p>No courses found for this professor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Professor Reviews Section */}
      <div className="professor-reviews-section">
        <h2>What Students Say About {professor.name}</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet for this professor.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="course-name">{review.course_name}</span>
                </div>
                <div className="review-ratings">
                  <span className="rating-label">Professor:</span>
                  <StarRating value={review.rating_professor} readOnly size={16} />
                  <span className="rating-label">Hardness:</span>
                  <StarRating value={review.rating_hardness} readOnly size={16} />
                </div>
                {review.features && (
                  <div className="review-features">
                    <span className="features-label">Features:</span>
                    <span className="features-list">
                      {review.features.split(',').map(f => f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                )}
                {review.review_text && (
                  <div className="review-text">
                    <p>{review.review_text}</p>
                  </div>
                )}
                <div className="review-footer">
                  <span className="review-author">By {review.user_name || 'Anonymous'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDetail; 