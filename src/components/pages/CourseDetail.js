import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coursesData from '../../data/courses.json';
import professorsData from '../../data/professors.json';
import './CourseDetail.css';

const CourseDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  // 尝试通过课程代码或名称查找课程
  const course = coursesData.courses.find(
    c => c.code.toLowerCase() === decodeURIComponent(code).toLowerCase() ||
         c.name.toLowerCase() === decodeURIComponent(code).toLowerCase()
  );

  if (!course) {
    return (
      <div className="course-detail-page">
        <h2>Course not found</h2>
        <button onClick={() => navigate('/dashboard/courses')} className="btn-primary">
          Back to Courses
        </button>
      </div>
    );
  }

  // 查找教授信息
  const professor = professorsData.professors.find(
    p => p.name.toLowerCase() === course.professor.toLowerCase()
  );

  const handleProfessorClick = () => {
    if (professor) {
      navigate(`/dashboard/professor/${encodeURIComponent(professor.name)}`);
    }
  };

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <h1 className="course-title">{course.name}</h1>
        <div className="course-code">{course.code}</div>
      </div>

      <div className="course-content">
        <div className="course-info-section">
          <h2>Course Information</h2>
          <div className="course-info-grid">
            <div className="info-item">
              <label>Course Code:</label>
              <span>{course.code}</span>
            </div>
            <div className="info-item">
              <label>Course Name:</label>
              <span>{course.name}</span>
            </div>
            <div className="info-item">
              <label>Professor:</label>
              <span 
                className="professor-link"
                onClick={handleProfessorClick}
                style={{ color: '#d63031', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {course.professor}
              </span>
            </div>
            {course.credits && (
              <div className="info-item">
                <label>Credits:</label>
                <span>{course.credits}</span>
              </div>
            )}
            {course.semester && (
              <div className="info-item">
                <label>Semester:</label>
                <span>{course.semester}</span>
              </div>
            )}
          </div>
        </div>

        {course.description && (
          <div className="course-description-section">
            <h2>Description</h2>
            <p>{course.description}</p>
          </div>
        )}

        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="course-prerequisites-section">
            <h2>Prerequisites</h2>
            <ul>
              {course.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </div>
        )}

        {course.objectives && course.objectives.length > 0 && (
          <div className="course-objectives-section">
            <h2>Learning Objectives</h2>
            <ul>
              {course.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {course.topics && course.topics.length > 0 && (
          <div className="course-topics-section">
            <h2>Course Topics</h2>
            <ul>
              {course.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="course-actions">
        <button onClick={() => navigate('/dashboard/courses')} className="btn-secondary">
          Back to Courses
        </button>
        {professor && (
          <button onClick={handleProfessorClick} className="btn-primary">
            View Professor Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetail; 