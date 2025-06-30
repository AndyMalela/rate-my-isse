import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ value, onChange, max = 5, readOnly = false, size = 22 }) => {
  const [hoverValue, setHoverValue] = useState(undefined);

  // 计算当前要高亮的分数
  const displayValue = hoverValue !== undefined ? hoverValue : value;

  const handleMouseMove = (i, e) => {
    if (readOnly) return;
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setHoverValue(i - 0.5);
    } else {
      setHoverValue(i);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverValue(undefined);
  };

  const handleClick = (i, e) => {
    if (readOnly || !onChange) return;
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      onChange(i - 0.5);
    } else {
      onChange(i);
    }
  };

  const stars = [];
  for (let i = 1; i <= max; i++) {
    let icon;
    if (displayValue >= i) {
      icon = solidStar;
    } else if (displayValue >= i - 0.5) {
      icon = faStarHalfAlt;
    } else {
      icon = regularStar;
    }
    stars.push(
      <span
        key={i}
        style={{ cursor: readOnly ? 'default' : 'pointer', fontSize: size, color: '#f7b500', marginRight: 2, transition: 'color 0.15s' }}
        onMouseMove={e => handleMouseMove(i, e)}
        onMouseLeave={handleMouseLeave}
        onClick={e => handleClick(i, e)}
        data-testid={`star-${i}`}
      >
        <FontAwesomeIcon icon={icon} />
      </span>
    );
  }
  return <span>{stars}</span>;
};

export default StarRating; 