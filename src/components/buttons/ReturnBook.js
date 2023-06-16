import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, get } from 'firebase/database';

const ReturnBook = ({ userId, bookId }) => {
  const [returned, setReturned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const confirmOrdersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
        const snapshot = await get(confirmOrdersRef);
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          if ('return' in orderData) {
            setReturned(orderData.return);
          }
        }
      } catch (error) {
        console.error('Error retrieving return status:', error);
      }
    };

    fetchData();
  }, [userId, bookId]);

  const handleReturnRequest = async () => {
    try {
      const db = getDatabase();
      const confirmOrdersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
      const updates = {};

      if (!returned) {
        updates.return = true;
        updates.returnTime = Date.now();
        setReturned(true);
        console.log('Book marked as returned');
      } else {
        updates.return = null;
        updates.returnTime = null;
        setReturned(false);
        console.log('Return field removed from book');
      }

      await update(confirmOrdersRef, updates);
    } catch (error) {
      console.error('Error sending return request:', error);
    }
  };

  return (
    <>
      {!returned && (
        <button
          onClick={handleReturnRequest}
          className='px-8 py-1 rounded-3xl border-[1.5px] border-[#980e0e] hover:bg-[#DE1212] hover:border-[#DE1212] text-[#980e0e] hover:text-white font-bold text-md w-fit'
        >
          Return
        </button>
      )}
      {returned && (
        <button
          onClick={handleReturnRequest}
          className='px-8 py-1 rounded-3xl border-[1.5px] border-[#980e0e] hover:bg-[#DE1212] hover:border-[#DE1212] text-[#980e0e] hover:text-white font-bold text-md w-fit'
        >
          Returned
        </button>
      )}
    </>
  );
};

export default ReturnBook;
