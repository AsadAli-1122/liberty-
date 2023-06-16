import React, { useState } from 'react';
import { Rating as SimpleRating } from 'react-simple-star-rating';

const CustomRating = () => {
  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SimpleRating
        onClick={handleRating}
        ratingValue={rating}
        size={20}
        // Add any other props you need
      />
    </div>
  );
};

export default CustomRating;
