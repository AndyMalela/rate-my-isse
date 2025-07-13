import React, { useState, useEffect } from 'react';
import axios from './axios';
import Select from 'react-select';
import StarRating from './StarRating';
import './RateProfessor.css'; // Ensure this includes new CSS below

export default function RateProfessorForm() {
  const [allCourses, setAllCourses] = useState([]);
  const [features, setFeatures] = useState([]);

  const [formData, setFormData] = useState({
    course_id: '',
    professor_id: '',
    rating_professor: 3,
    rating_hardness: 3,
    review_text: '',
    feature_ids: [],
  });

  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    axios.get('/api/courses').then((res) => setAllCourses(res.data));
    axios.get('/api/ratings/features').then((res) => setFeatures(res.data));
  }, []);

  const handleCourseChange = (selectedOption) => {
    const course = allCourses.find((c) => c.id === selectedOption.value);
    setSelectedCourse(course);
    setFormData({
      ...formData,
      course_id: course.id,
      professor_id: course.professor_id,
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFeatureToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      feature_ids: prev.feature_ids.includes(id)
        ? prev.feature_ids.filter((fid) => fid !== id)
        : [...prev.feature_ids, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/ratings', formData, { withCredentials: true });
      alert('Rating submitted!');
      setFormData({
        course_id: '',
        professor_id: '',
        rating_professor: 3,
        rating_hardness: 3,
        review_text: '',
        feature_ids: [],
      });
      setSelectedCourse(null);
    } catch (err) {
      console.error(err);
      alert('Error submitting rating');
    }
  };

  const renderFeature = (keys) => {
    return features
      .filter((f) => keys.includes(f.name))
      .map((f) => (
        <label key={f.id} className="feature-checkbox">
          <input
            type="checkbox"
            checked={formData.feature_ids.includes(f.id)}
            onChange={() => handleFeatureToggle(f.id)}
          />
          {f.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </label>
      ));
  };

  return (
    <form onSubmit={handleSubmit} className="rate-form">
      <h2>Rate a Professor</h2>

      <label>Course</label>
      <Select
        options={allCourses.map((c) => ({
          value: c.id,
          label: c.course_name,
        }))}
        value={
          formData.course_id
            ? {
                value: formData.course_id,
                label:
                  allCourses.find((c) => c.id === formData.course_id)
                    ?.course_name || '',
              }
            : null
        }
        onChange={handleCourseChange}
        placeholder="Select a course..."
        required
      />

      <label>Professor</label>
      <Select
        isDisabled
        value={
          selectedCourse
            ? {
                value: selectedCourse.professor_id,
                label: selectedCourse.professor_name,
              }
            : null
        }
        placeholder="Professor will appear here..."
      />

      <label>Professor Rating</label>
      <StarRating
        value={formData.rating_professor}
        onChange={(value) =>
          setFormData({ ...formData, rating_professor: value })
        }
      />

      <label>Course Hardness</label>
      <StarRating
        value={formData.rating_hardness}
        onChange={(value) =>
          setFormData({ ...formData, rating_hardness: value })
        }
      />

      <label>Review</label>
      <textarea
        name="review_text"
        value={formData.review_text}
        onChange={handleChange}
        placeholder="Write your thoughts..."
        rows="4"
      />

      <label>Features:</label>
      <div className="features-grid">
        <div className="feature-group">
          <h4>Workload & Grading</h4>
          {renderFeature([
            'lots_of_homework',
            'tough_grader',
            'curved_grading',
            'extra_credit_available',
          ])}
        </div>
        <div className="feature-group">
          <h4>Exams & Assessment</h4>
          {renderFeature([
            'fair_exams',
            'difficult_exams',
            'easy_exams',
            'good_feedback',
          ])}
        </div>
        <div className="feature-group">
          <h4>Projects & Assignments</h4>
          {renderFeature([
            'group_projects',
            'individual_projects',
            'flexible_deadlines',
            'strict_deadlines',
          ])}
        </div>
        <div className="feature-group">
          <h4>Teaching Style</h4>
          {renderFeature([
            'engaging_lectures',
            'clear_explanations',
            'helpful_office_hours',
            'participation_required',
          ])}
        </div>
        <div className="feature-group">
          <h4>Course Requirements</h4>
          {renderFeature([
            'attendance_required',
            'online_materials',
            'textbook_required',
          ])}
        </div>
      </div>

      <button type="submit">Submit Rating</button>
    </form>
  );
}
