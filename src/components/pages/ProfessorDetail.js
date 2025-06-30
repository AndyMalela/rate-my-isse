import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import professorsData from '../../data/professors.json';
import coursesData from '../../data/courses.json';
import ratingsJson from '../../data/ratings.json';
import StarRating from '../StarRating';
import './ProfessorDetail.css';

const RATING_DIMENSIONS = [
  { key: 'overall', label: 'Overall' },
  { key: 'friendliness', label: 'Friendliness' },
  { key: 'professionalism', label: 'Professionalism' }
];

function getLocalRatings() {
  const local = localStorage.getItem('professorRatings');
  let ratingsData;
  
  if (local) {
    ratingsData = JSON.parse(local);
  } else {
    ratingsData = ratingsJson;
  }
  
  // 确保所有教授都在 ratings 数据中
  const allProfessors = professorsData.professors.map(p => p.name);
  const missingProfessors = allProfessors.filter(profName => 
    !ratingsData.ratings.some(r => r.professor.toLowerCase() === profName.toLowerCase())
  );
  
  if (missingProfessors.length > 0) {
    missingProfessors.forEach(profName => {
      ratingsData.ratings.push({ professor: profName, ratings: [] });
    });
    // 保存更新后的数据
    localStorage.setItem('professorRatings', JSON.stringify(ratingsData));
  }
  
  return ratingsData;
}

function saveLocalRatings(data) {
  localStorage.setItem('professorRatings', JSON.stringify(data));
}

const ProfessorDetail = ({ user }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const professor = professorsData.professors.find(
    prof => prof.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );

  // Hooks必须在组件顶层调用
  const [form, setForm] = useState({ overall: 0, friendliness: 0, professionalism: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [allRatings, setAllRatings] = useState([]);

  const userName = (user && user.username) || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : '');

  // 读取评分数据（localStorage优先）
  useEffect(() => {
    if (!professor) return;
    const local = getLocalRatings();
    const entry = local.ratings.find(r => r.professor.toLowerCase() === professor.name.toLowerCase());
    setAllRatings(entry ? entry.ratings : []);
  }, [professor]);

  // 当前用户评分
  useEffect(() => {
    if (!professor) return;
    const userRating = allRatings.find(r => r.user === userName) || { overall: 0, friendliness: 0, professionalism: 0 };
    setForm({ ...userRating });
  }, [professor, allRatings, userName]);

  if (!professor) return <div className="professor-detail-page"><h2>Professor not found</h2></div>;

  // 获取教授所教课程的详细信息
  const taughtCourses = professor.courses.map(courseName => {
    return coursesData.courses.find(
      c => c.name.toLowerCase() === courseName.toLowerCase()
    ) || { name: courseName, code: '', professor: professor.name };
  });

  // 只设置一次默认图片，避免闪烁
  const handleImgError = (e) => {
    if (!e.target.src.includes('default.jpg')) {
      e.target.onerror = null;
      e.target.src = process.env.PUBLIC_URL + '/default.jpg';
    }
  };

  // 计算平均分和人数
  const averages = {};
  RATING_DIMENSIONS.forEach(dim => {
    const sum = allRatings.reduce((acc, r) => acc + (r[dim.key] || 0), 0);
    averages[dim.key] = allRatings.length ? (sum / allRatings.length) : 0;
  });
  const numRatings = allRatings.length;

  const handleStarChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 更新localStorage
    const local = getLocalRatings();
    const idx = local.ratings.findIndex(r => r.professor.toLowerCase() === professor.name.toLowerCase());
    
    if (idx === -1) {
      console.error('Professor not found in ratings data:', professor.name);
      return;
    }
    const ratingsArr = local.ratings[idx].ratings;
    const userIdx = ratingsArr.findIndex(r => r.user === userName);
    if (userIdx !== -1) {
      ratingsArr[userIdx] = { user: userName, ...form };
    } else {
      ratingsArr.push({ user: userName, ...form });
    }
    local.ratings[idx].ratings = ratingsArr;
    saveLocalRatings(local);
    setAllRatings([...ratingsArr]);
    setSubmitted(true);
  };

  return (
    <div className="professor-detail-page new-layout">
      <div className="professor-photo-col">
        <img
          src={process.env.PUBLIC_URL + '/' + (professor.photo || 'default.jpg')}
          alt={professor.name}
          className="professor-photo-large"
          onError={handleImgError}
        />
        <div className="professor-rating-summary">
          {RATING_DIMENSIONS.map(dim => (
            <div className="professor-rating-row" key={dim.key}>
              <span className="professor-rating-label">{averages[dim.key].toFixed(1)}</span>
              <StarRating value={averages[dim.key]} readOnly size={20} />
              <span className="professor-rating-count">({numRatings})</span>
              <span className="professor-rating-dim-label">{dim.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="professor-info-col">
        <h1 className="professor-name">{professor.name}</h1>
        <table className="professor-info-table">
          <tbody>
            {professor.department && (
              <tr>
                <th>Department</th>
                <td>{professor.department}</td>
              </tr>
            )}
            {professor.title && (
              <tr>
                <th>Title</th>
                <td>{professor.title}</td>
              </tr>
            )}
            {professor.rating !== undefined && professor.rating !== 0 && (
              <tr>
                <th>Rating</th>
                <td>{professor.rating} / 5</td>
              </tr>
            )}
            <tr>
              <th>Courses Taught</th>
              <td>
                <ul className="professor-courses-list">
                  {taughtCourses.map((course, idx) => (
                    <li key={idx}>
                      <span
                        className="course-link"
                        onClick={() => navigate(`/dashboard/course/${encodeURIComponent(course.code || course.name)}`)}
                        style={{ color: '#d63031', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {course.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="professor-rating-form-wrapper">
          <h3 style={{marginTop:32,marginBottom:16}}>Your Rating</h3>
          <form onSubmit={handleSubmit} className="professor-rating-form">
            {RATING_DIMENSIONS.map(dim => (
              <div className="professor-rating-form-row" key={dim.key}>
                <span className="professor-rating-dim-label">{dim.label}</span>
                <StarRating value={form[dim.key] || 0} onChange={v => handleStarChange(dim.key, v)} size={28} />
                <span className="professor-rating-value">{form[dim.key] ? form[dim.key].toFixed(1) : ''}</span>
              </div>
            ))}
            <button type="submit" className="btn-primary" style={{marginTop:16}}>
              {submitted ? 'Resubmit' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetail; 