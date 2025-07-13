import React from 'react';
import './StarRating.css'; // Optional for styling

const StarRating = ({ value, onChange, readOnly = false, size = 24 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange(star)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            color: value >= star ? '#ffc107' : '#e4e5e9',
            fontSize: `${size}px`,
            marginRight: 4
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
