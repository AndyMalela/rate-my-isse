import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FindCourse.css';

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'ig');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <strong key={i}>{part}</strong> : part
  );
}

const FindCourse = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchCourses = async (searchTerm) => {
    try {
      const res = await axios.get(`/api/courses?search=${encodeURIComponent(searchTerm)}`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    // Preload some courses on mount
    const preload = async () => {
      const courses = await fetchCourses('');
      setResults(courses.slice(0, 10));
    };
    preload();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const courses = await fetchCourses(query);
    setResults(courses);
    setShowSuggestions(false);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const courses = await fetchCourses(value);
    setSuggestions(courses);
    setShowSuggestions(courses.length > 0);
    setHighlightIndex(-1);
  };

  const handleSuggestionClick = (course) => {
    setQuery(course.course_name);
    setShowSuggestions(false);
    navigate(`/dashboard/course/${course.id}`);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightIndex(idx => Math.min(idx + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSuggestionClick(suggestions[highlightIndex]);
      }
    }
  };

  return (
    <div className="find-course-page">
      <h2>Find my Course</h2>
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter course name..."
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((course, idx) => (
                <li
                  key={course.id}
                  className={highlightIndex === idx ? 'highlight' : ''}
                  onMouseDown={() => handleSuggestionClick(course)}
                  style={{ cursor: 'pointer' }}
                >
                  {highlightMatch(course.course_name, query)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>
      <div className="results-list">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((course) => (
          <div key={course.id} className="course-card" onClick={() => navigate(`/dashboard/course/${course.id}`)} style={{cursor:'pointer'}}>
            <h3>{course.course_name}</h3>
            <p><strong>Period:</strong> {course.period}</p>
            <p><strong>Semester Term:</strong> {course.semester_term}</p>
            <p><strong>Language:</strong> {course.language}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindCourse; 