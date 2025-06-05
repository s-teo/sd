import React from 'react';

const StarRating = ({ rating = 0, maxRating = 5, onChange, interactive = false }) => {
  // rating - число от 0 до maxRating
  // onChange - функция (если нужно интерактивно выбирать рейтинг)
  // interactive - переключатель, можно ли кликать

  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating;
    stars.push(
      <span
        key={i}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          color: filled ? '#ffb400' : '#ddd',
          fontSize: '20px',
          userSelect: 'none',
          transition: 'color 0.2s',
        }}
        onClick={() => interactive && onChange && onChange(i)}
        onMouseEnter={(e) => {
          if (interactive) e.target.style.color = '#ffdb70';
        }}
        onMouseLeave={(e) => {
          if (interactive) e.target.style.color = filled ? '#ffb400' : '#ddd';
        }}
      >
        ★
      </span>
    );
  }

  return <div>{stars}</div>;
};

export default StarRating;
