import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import BackandHeading from '../components/header/BackandHeading';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Transaction = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const filteredTransactions = transactions.filter(transaction => transaction.UserId === user?.uid).reverse();

  useEffect(() => {
    const db = getDatabase();
    const transactionsRef = ref(db, 'transactions');

    onValue(transactionsRef, (snapshot) => {
      const transactionsData = snapshot.val();
      if (transactionsData) {
        const transactionsList = Object.values(transactionsData);
        setTransactions(transactionsList);
      }
    });
  }, []);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${formattedDay}-${formattedMonth}-${year}`;
  }

  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (sectionId) => {
    setOpenSections((prevOpenSections) => {
      const isOpen = prevOpenSections.includes(sectionId);
      if (isOpen) {
        return prevOpenSections.filter((id) => id !== sectionId);
      } else {
        return [...prevOpenSections, sectionId];
      }
    });
  };

  return (
    <div className='mx-auto max-w-5xl'>
      <BackandHeading topHeading={'Transactions'} />
      <div className='my-4 mb-10 border border-gray-400 py-8 rounded-2xl shadow shadow-gray-400 px-4'>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <div className='flex items-start my-4' key={transaction.PaymentId}>
              <i className={`px-2 fa-solid fa-chevron-right duration-200 ease-in-out pt-2 text-2xl cursor-pointer ${openSections.includes(transaction.PaymentId) ? 'rotate-90' : ''}`} onClick={() => toggleSection(transaction.PaymentId)}></i>
              <div className={`w-full overflow-hidden duration-500 ease-in-out max-h-12 border border-gray-400 py-1 pl-3 pr-4 rounded-lg ${openSections.includes(transaction.PaymentId) ? 'max-h-60' : ''}`}>
                <div className='flex justify-between items-center cursor-pointer my-1' onClick={() => toggleSection(transaction.PaymentId)}>
                  <h2 className='text-xl font-semibold'>
                    Transaction ID: <span className='font-bold text-[#DE1212]'>{transaction.PaymentId}</span>
                  </h2>
                  <p className='text-lg tracking-wider text-green-600 font-bold'>{formatTimestamp(transaction.time)}</p>
                </div>
                <div className='mt-3 pl-8 max-h-40 overflow-scroll border-t-2 border-gray-300 pt-2'>
                  <p className='text-lg font-semibold'>Total Pay Amount: <span className='font-bold text-[#DE1212]'>{transaction.totalPayment} USD</span></p>
                  <h3 className='text-lg font-semibold'>
                    {transaction.books && Object.values(transaction.books).length > 1
                      ? `Books : ${Object.values(transaction.books).length}`
                      : 'Book'}
                  </h3>
                  {transaction.books ? (
                    Object.entries(transaction.books).map(([bookId, book]) => (
                      <div key={bookId} className='flex justify-between pl-4'>
                        <p className='font-bold '>{book.booktitle}</p>
                        <p className='font-bold '>{book.price * book.borrowTime} UGX for {book.borrowTime} - {book.borrowTimePeriod}</p>
                      </div>
                    ))
                  ) : (
                    <p>No books found for this transaction.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className='text-2xl'>No transactions found.</h1>
        )}
      </div>
    </div>
  );
};

export default Transaction;
