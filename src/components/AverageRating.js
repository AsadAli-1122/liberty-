import React, { useEffect, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import { Rating } from '@mui/material';
import { app } from '../context/firebase';

const AverageRating = ({ bookId ,size }) => {
  const [averageRating, setAverageRating] = useState(0);
  const db = getDatabase(app);

  useEffect(() => {
    if (bookId) {
      const ratingsRef = ref(db, `Ratings/${bookId}`);
      onValue(ratingsRef, (snapshot) => {
        const ratingsData = snapshot.val();
        if (ratingsData) {
          const ratingsList = Object.values(ratingsData);
          const totalRating = ratingsList.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = totalRating / ratingsList.length;
          setAverageRating(averageRating);
        }
      });
    }
  }, [bookId, db]);

  return (
    <div>
      <Rating name="read-only" value={averageRating} size={size} readOnly />
    </div>
  );
};

export default AverageRating;
