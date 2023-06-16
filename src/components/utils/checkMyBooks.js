import { ref as databaseRef, onValue, off, getDatabase } from 'firebase/database';
import { app } from '../../context/firebase';

export const CheckMyBooks = (userId, bookId, handleExtendTime, handleBorrowAgain, handleBorrowNow) => {
  if (!userId) {
    console.log('userId is not defined');
    return;
  }

  const db = getDatabase(app);
  const ordersRef = databaseRef(db, 'ConfirmOrders');
  
  onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const filteredData = Object.values(data).filter((order) => order.userUid === userId);
      const extractedBooks = filteredData.reduce((bookList, order) => {
        order.books.forEach((book) => {
          const purchaseDate = new Date(book.time).toLocaleDateString();
          const borrowTime = book.borrowTime.toLowerCase();
          let borrowTimeInDays;

          if (borrowTime.includes('months')) {
            const months = parseInt(borrowTime.split(' ')[0]);
            borrowTimeInDays = months * 30;
          } else if (borrowTime.includes('weeks')) {
            const weeks = parseInt(borrowTime.split(' ')[0]);
            borrowTimeInDays = weeks * 7;
          } else {
            borrowTimeInDays = parseInt(borrowTime.split(' ')[0]);
          }

          const returnDate = new Date(book.time + borrowTimeInDays * 24 * 60 * 60 * 1000);
          const timeLeft = Math.ceil((returnDate - Date.now()) / (24 * 60 * 60 * 1000));

          bookList.push({
            bookId: book.bookId,
            borrowTime: borrowTime,
            purchaseDate: purchaseDate,
            timeLeft: timeLeft,
          });
        });
        return bookList;
      }, []);

      const foundBook = extractedBooks.find((book) => book.bookId === bookId);
      if (foundBook) {
        if (foundBook.timeLeft !== 0) {
          // Option to extend time
          handleExtendTime();
          console.log('Extend time');
        } else {
          // Option to borrow again
          handleBorrowAgain();
          console.log('Borrow again');
        }
      } else {
        // Option to borrow now
        handleBorrowNow();
        console.log('Borrow now');
      }
    }
  });

  return () => {
    off(ordersRef);
  };
};
