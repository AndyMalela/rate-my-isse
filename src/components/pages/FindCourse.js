import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import coursesData from '../../data/courses.json';
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

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = coursesData.courses.filter(course =>
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.code.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = coursesData.courses.filter(course =>
      course.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setHighlightIndex(-1);
  };

  const handleSuggestionClick = (course) => {
    setQuery(course.name);
    setShowSuggestions(false);
    navigate(`/dashboard/course/${encodeURIComponent(course.code || course.name)}`);
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
            placeholder="Enter course name or code..."
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
                  key={course.code + course.name}
                  className={highlightIndex === idx ? 'highlight' : ''}
                  onMouseDown={() => handleSuggestionClick(course)}
                  style={{ cursor: 'pointer' }}
                >
                  {highlightMatch(course.name, query)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>
      <div className="results-list">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((course, idx) => (
          <div key={idx} className="course-card" onClick={() => navigate(`/dashboard/course/${encodeURIComponent(course.code || course.name)}`)} style={{cursor:'pointer'}}>
            <h3>{course.name}</h3>
            <p><strong>Code:</strong> {course.code}</p>
            <p><strong>Professor:</strong> {course.professor}</p>
            {course.category && <p><strong>Category:</strong> {course.category}</p>}
            {course.group && <p><strong>Group:</strong> {course.group}</p>}
            {course.credit !== undefined && <p><strong>Credit:</strong> {course.credit}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindCourse; 