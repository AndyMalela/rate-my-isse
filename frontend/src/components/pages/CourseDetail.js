import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../StarRating';
import './CourseDetail.css';

const CourseDetail = ({ user }) => {
  const { code: id } = useParams(); // 'code' param is now actually the course ID
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [form, setForm] = useState({ rating_professor: 0, rating_hardness: 0, feature_ids: [], review_text: '', professor_id: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseRes = await axios.get(`/api/courses/${id}`);
        setCourse(courseRes.data);
        // Fetch reviews
        const reviewsRes = await axios.get(`/api/ratings/course/${id}`);
        setReviews(reviewsRes.data);
        // Fetch features
        const featuresRes = await axios.get('/api/ratings/features');
        setFeatures(featuresRes.data);
        // Fetch user review if logged in
        if (user && user.id) {
          console.log('Fetching user review for user ID:', user.id, 'course ID:', id); // Debug log
          const userReviewRes = await axios.get(`/api/ratings/user/${user.id}/course/${id}`);
          console.log('User review response:', userReviewRes.data); // Debug log
          setUserReview(userReviewRes.data);
          if (userReviewRes.data) {
            console.log('Setting form with user review data'); // Debug log
            setForm({
              rating_professor: userReviewRes.data.rating_professor,
              rating_hardness: userReviewRes.data.rating_hardness,
              feature_ids: (userReviewRes.data.features || '').split(',').filter(Boolean),
              review_text: userReviewRes.data.review_text || '',
              professor_id: userReviewRes.data.professor_id || (courseRes.data.professors && courseRes.data.professors.length > 0 ? courseRes.data.professors[0]?.id : 'no_professor')
            });
            setEditing(true);
            setShowEditForm(false); // Hide form by default if user has a review
          } else {
            console.log('No user review found, setting editing to false'); // Debug log
            setForm(f => ({ 
              ...f, 
              professor_id: courseRes.data.professors && courseRes.data.professors.length > 0 
                ? courseRes.data.professors[0]?.id 
                : 'no_professor' 
            }));
            setEditing(false);
            setShowEditForm(true); // Show form if user has no review
          }
        } else {
          console.log('No user or user.id, setting editing to false'); // Debug log
          setForm(f => ({ 
            ...f, 
            professor_id: courseRes.data.professors && courseRes.data.professors.length > 0 
              ? courseRes.data.professors[0]?.id 
              : 'no_professor' 
          }));
          setEditing(false);
          setShowEditForm(true); // Show form if user is not logged in
        }
        setError(null);
      } catch (err) {
        setError('Course not found or failed to load.');
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id, user]);

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setSubmitError(null);
    setSuccessMsg(null);
  };

  const handleFeatureToggle = (fid) => {
    setForm(f => ({
      ...f,
      feature_ids: f.feature_ids.includes(fid)
        ? f.feature_ids.filter(id => id !== fid)
        : [...f.feature_ids, fid]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);
    try {
      if (!form.professor_id) {
        setSubmitError('Please select a professor.');
        return;
      }
      const payload = {
        course_id: id,
        professor_id: form.professor_id,
        rating_professor: form.rating_professor,
        rating_hardness: form.rating_hardness,
        feature_ids: form.feature_ids,
        review_text: form.review_text
      };
      if (editing && userReview) {
        await axios.put(`/api/ratings/${userReview.id}`, payload);
        setSuccessMsg('Review updated!');
      } else {
        await axios.post('/api/ratings', payload);
        setSuccessMsg('Review submitted!');
      }
      
      // Refresh reviews and fetch user's review
      const [reviewsRes, userReviewRes] = await Promise.all([
        axios.get(`/api/ratings/course/${id}`),
        axios.get(`/api/ratings/user/${user.id}/course/${id}`)
      ]);
      
      setReviews(reviewsRes.data);
      setUserReview(userReviewRes.data);
      
      if (userReviewRes.data) {
        setForm({
          rating_professor: userReviewRes.data.rating_professor,
          rating_hardness: userReviewRes.data.rating_hardness,
          feature_ids: (userReviewRes.data.features || '').split(',').filter(Boolean),
          review_text: userReviewRes.data.review_text || '',
          professor_id: userReviewRes.data.professor_id || (course.professors && course.professors.length > 0 ? course.professors[0]?.id : 'no_professor')
        });
        setEditing(true);
        setShowEditForm(false); // Hide form after successful submission
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to submit review.');
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
    setEditing(true);
    setForm({
      rating_professor: userReview.rating_professor,
      rating_hardness: userReview.rating_hardness,
      feature_ids: (userReview.features || '').split(',').filter(Boolean),
      review_text: userReview.review_text || '',
      professor_id: userReview.professor_id || (course.professors && course.professors.length > 0 ? course.professors[0]?.id : 'no_professor')
    });
  };
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!userReview) return;
    try {
      await axios.delete(`/api/ratings/${userReview.id}`);
      setUserReview(null);
      setEditing(false);
      setShowEditForm(true); // Show form for new review
      setForm({ 
        rating_professor: 0, 
        rating_hardness: 0, 
        feature_ids: [], 
        review_text: '', 
        professor_id: course.professors && course.professors.length > 0 
          ? course.professors[0]?.id 
          : 'no_professor' 
      });
      setSuccessMsg('Review deleted.');
      // Refresh reviews
      const reviewsRes = await axios.get(`/api/ratings/course/${id}`);
      setReviews(reviewsRes.data);
    } catch (err) {
      setSubmitError('Failed to delete review.');
    }
  };

  const formatFeatureName = (name) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const organizeFeatures = (features) => {
    const categories = {
      'Workload & Grading': ['lots_of_homework', 'tough_grader', 'curved_grading', 'extra_credit_available'],
      'Exams & Assessment': ['fair_exams', 'difficult_exams', 'easy_exams', 'good_feedback'],
      'Projects & Assignments': ['group_projects', 'individual_projects', 'flexible_deadlines', 'strict_deadlines'],
      'Teaching Style': ['engaging_lectures', 'clear_explanations', 'helpful_office_hours', 'participation_required'],
      'Course Requirements': ['attendance_required', 'online_materials', 'textbook_required']
    };

    const organized = {};
    Object.keys(categories).forEach(category => {
      organized[category] = features.filter(f => categories[category].includes(f.name));
    });
    return organized;
  };

  if (loading) return <div className="course-detail-page"><h2>Loading...</h2></div>;
  if (error || !course) return <div className="course-detail-page"><h2>{error || 'Course not found'}</h2></div>;

  console.log('CourseDetail render - user:', user); // Debug log
  console.log('CourseDetail render - course:', course); // Debug log
  console.log('CourseDetail render - userReview:', userReview); // Debug log
  console.log('CourseDetail render - editing:', editing); // Debug log

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <h1 className="course-title">{course.course_name}</h1>
        <div className="course-code">ID: {course.id}</div>
      </div>

      <div className="course-content">
        <div className="course-info-section">
          <h2>Course Information</h2>
          <div className="course-info-grid">
            <div className="info-item">
              <label>Course Name:</label>
              <span>{course.course_name}</span>
            </div>
            <div className="info-item">
              <label>Professors:</label>
              <span>
                {course.professors && course.professors.length > 0 ? (
                  course.professors.map((prof) => (
              <span 
                      key={prof.id}
                className="professor-link"
                      onClick={() => navigate(`/dashboard/professor/${prof.id}`)}
              >
                      {prof.name}
                    </span>
                  )).reduce((prev, curr) => [prev, ', ', curr])
                ) : 'N/A'}
              </span>
            </div>
            {course.period && (
              <div className="info-item">
                <label>Period:</label>
                <span>{course.period}</span>
              </div>
            )}
            {course.semester_term && (
              <div className="info-item">
                <label>Semester Term:</label>
                <span>{course.semester_term}</span>
              </div>
            )}
            {course.language && (
              <div className="info-item">
                <label>Language:</label>
                <span>{course.language}</span>
              </div>
            )}
          </div>
        </div>

        <div className="course-reviews-section">
          <h2>Course Reviews</h2>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div><b>Professor:</b> {review.professor_name}</div>
              <div><b>Professor Rating:</b> <StarRating value={review.rating_professor} readOnly size={18} /></div>
              <div><b>Hardness Rating:</b> <StarRating value={review.rating_hardness} readOnly size={18} /></div>
              <div><b>Features:</b> {review.features ? (
                <span className="review-features">
                  {review.features.split(',').map(feature => 
                    formatFeatureName(feature.trim())
                  ).join(', ')}
                </span>
              ) : 'None'}</div>
              <div><b>Review:</b> {review.review_text}</div>
              <div style={{ fontSize: 12, color: '#888' }}>By {review.user_name || `User ID: ${review.user_id}`}</div>
              {user && userReview && review.id === userReview.id && (
                <div className="review-actions">
                  <button className="btn-secondary" onClick={handleEditClick} style={{marginRight:8}}>Edit</button>
                  <button className="btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        )}
            </div>
          ))}
          </div>
        {user && showEditForm && (
          <div className="course-review-form-section">
            <h2>{editing ? 'Edit Your Review' : 'Post a Review'}</h2>
            <form onSubmit={handleSubmit} className="course-review-form">
              <div className="form-group">
                <label>Professor:</label>
                <select
                  value={form.professor_id}
                  onChange={e => handleFormChange('professor_id', e.target.value)}
                  required
                >
                  <option value="">Select Professor</option>
                  {course.professors && course.professors.length > 0 ? (
                    course.professors.map(prof => (
                      <option key={prof.id} value={prof.id}>{prof.name}</option>
                    ))
                  ) : (
                    <option value="no_professor">No Professor Assigned</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Professor Rating:</label>
                <StarRating value={form.rating_professor} onChange={v => handleFormChange('rating_professor', v)} />
              </div>
              <div className="form-group">
                <label>Hardness Rating:</label>
                <StarRating value={form.rating_hardness} onChange={v => handleFormChange('rating_hardness', v)} />
              </div>
              <div className="form-group">
                <label>Features:</label>
                <div className="features-checkboxes">
                  {Object.entries(organizeFeatures(features)).map(([category, categoryFeatures]) => (
                    <div key={category} className="feature-category">
                      <h4 style={{ margin: '16px 0 8px 0', color: '#d63031', fontSize: '14px', fontWeight: '600' }}>
                        {category}
                      </h4>
                      <div className="feature-grid">
                        {categoryFeatures.map(f => (
                          <label key={f.id} className="feature-checkbox">
                            <input
                              type="checkbox"
                              checked={form.feature_ids.includes(f.id.toString())}
                              onChange={() => handleFeatureToggle(f.id.toString())}
                            />
                            <span>{formatFeatureName(f.name)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Review:</label>
                <textarea
                  value={form.review_text}
                  onChange={e => handleFormChange('review_text', e.target.value)}
                  rows={3}
                  style={{ width: '100%' }}
                />
          </div>
              {submitError && <div style={{ color: 'red', marginBottom: 8 }}>{submitError}</div>}
              {successMsg && <div style={{ color: 'green', marginBottom: 8 }}>{successMsg}</div>}
              <button type="submit" className="btn-primary" style={{ marginRight: 12 }}>
                {editing ? 'Update Review' : 'Submit Review'}
              </button>
              {editing && (
                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail; 