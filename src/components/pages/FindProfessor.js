import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import professorsData from '../../data/professors.json';
import './FindProfessor.css';

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'ig');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <strong key={i}>{part}</strong> : part
  );
}

const FindProfessor = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = professorsData.professors.filter(prof =>
      prof.name.toLowerCase().includes(query.toLowerCase()) ||
      prof.department.toLowerCase().includes(query.toLowerCase())
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
    const filtered = professorsData.professors.filter(prof =>
      prof.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setHighlightIndex(-1);
  };

  const handleSuggestionClick = (prof) => {
    setQuery(prof.name);
    setShowSuggestions(false);
    navigate(`/dashboard/professor/${encodeURIComponent(prof.name)}`);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100); // 延迟隐藏，允许点击
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
    <div className="find-professor-page">
      <h2>Find my Professor</h2>
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter professor name or department..."
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((prof, idx) => (
                <li
                  key={prof.name}
                  className={highlightIndex === idx ? 'highlight' : ''}
                  onMouseDown={() => handleSuggestionClick(prof)}
                  style={{ cursor: 'pointer' }}
                >
                  {highlightMatch(prof.name, query)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>
      <div className="results-list">
        {results.length === 0 && <p>No results found.</p>}
        {results.map((prof, idx) => (
          <div key={idx} className="professor-card" onClick={() => navigate(`/dashboard/professor/${encodeURIComponent(prof.name)}`)} style={{cursor:'pointer'}}>
            <h3>{prof.name}</h3>
            <p><strong>Department:</strong> {prof.department}</p>
            <p><strong>Rating:</strong> {prof.rating} / 5</p>
            <p><strong>Courses:</strong> {prof.courses.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindProfessor; 