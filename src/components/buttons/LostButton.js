import React, { useState, useEffect } from 'react';
import { getDatabase, ref, update, get } from 'firebase/database';

const LostButton = ({ userId, bookId }) => {
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const confirmOrdersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
        const snapshot = await get(confirmOrdersRef);
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          if ('lost' in orderData) {
            setLost(orderData.lost);
          }
        }
      } catch (error) {
        console.error('Error retrieving lost status:', error);
      }
    };

    fetchData();
  }, [userId, bookId]);

  const handleLostRequest = async () => {
    try {
      const db = getDatabase();
      const confirmOrdersRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
      const updates = {};

      if (!lost) {
        updates.lost = true;
        updates.lostTime = Date.now();
        setLost(true);
        console.log('Book marked as lost');
      } else {
        updates.lost = null;
        updates.lostTime = null;
        setLost(false);
        console.log('Lost field removed from book');
      }

      await update(confirmOrdersRef, updates);
    } catch (error) {
      console.error('Error sending lost request:', error);
    }
  };

  return (
    <>
      {!lost && (
        <button
          onClick={handleLostRequest}
          className='px-8 py-1 rounded-3xl border-[1.5px] border-[#980e0e] hover:bg-[#DE1212] hover:border-[#DE1212] text-[#980e0e] hover:text-white font-bold text-md w-fit'
        >
          Lost
        </button>
      )}
      {lost && (
        <button
          onClick={handleLostRequest}
          className='px-8 py-1 rounded-3xl border-[1.5px] bg-[#DE1212] border-[#DE1212] hover:bg-[#980e0e] hover:border-[#980e0e] text-white font-semibold text-md w-fit'
        >
          Losted
        </button>
      )}
    </>
  );
};

export default LostButton;
