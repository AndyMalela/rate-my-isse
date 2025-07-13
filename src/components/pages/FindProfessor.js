import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const fetchProfessors = async (searchTerm) => {
    try {
      const res = await axios.get(`/api/professors?search=${encodeURIComponent(searchTerm)}`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const profs = await fetchProfessors(query);
    setResults(profs);
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
    const profs = await fetchProfessors(value);
    setSuggestions(profs);
    setShowSuggestions(profs.length > 0);
    setHighlightIndex(-1);
  };

  const handleSuggestionClick = (prof) => {
    setQuery(prof.name);
    setShowSuggestions(false);
    navigate(`/dashboard/professor/${prof.id}`);
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

  useEffect(() => {
    // Preload some professors on mount
    const preload = async () => {
      const profs = await fetchProfessors('');
      setResults(profs.slice(0, 10));
    };
    preload();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="find-professor-page">
      <h2>Find my Professor</h2>
      <form onSubmit={handleSearch} className="search-form" autoComplete="off">
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter professor name..."
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
                  key={prof.id}
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
          <div key={prof.id} className="professor-card" onClick={() => navigate(`/dashboard/professor/${prof.id}`)} style={{cursor:'pointer'}}>
            <h3>{prof.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindProfessor; 