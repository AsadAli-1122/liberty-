import React, { useContext, useEffect, useState } from 'react';
import BackandHeading from '../components/header/BackandHeading';
import { AuthContext } from '../context/AuthContext';
import { getDatabase, ref, onValue, remove, off, set, get } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import RemoveButton from '../components/buttons/RemoveButton';
import { app } from '../context/firebase';
import { getBorrowTimeMultiplier } from '../components/utils/Functions';

import PaymentModal from '../components/PaymenyModal';
import { convertUGXtoUSD } from '../components/utils/CurrencyConverter';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [matchedBooks, setMatchedBooks] = useState([]);
  const [timeSelect, setTimeSelect] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalInUSD, setTotalInUSD] = useState(0);
  const navigate = useNavigate();
  const [booksData, setBooksData] = useState([]);
  

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const confirmOrdersRef = ref(db, 'ConfirmOrders');

      onValue(confirmOrdersRef, (snapshot) => {
        const confirmOrdersData = snapshot.val();
        if (confirmOrdersData) {
          // Check if any book in the cart is already in ConfirmOrders
          matchedBooks.forEach((book) => {
            const bookExists = Object.values(confirmOrdersData).some((order) => {
              return (
                order.UserId === user.uid &&
                order.BookId === book.id &&
                order.time // Check if time field exists
              );
            });
            if (bookExists) {
              // Book is already in ConfirmOrders with a time field
              const updatedTimeSelect = { ...timeSelect };
              updatedTimeSelect[book.id] += book.borrowTime.value; // Add borrowTime to existing timeSelect value
              setTimeSelect(updatedTimeSelect);
            }
          });
        }
      });
    }
  }, [user, matchedBooks, timeSelect]);

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const cartRef = ref(db, `Carts/${user.uid}`);

      onValue(cartRef, (snapshot) => {
        const cartData = snapshot.val();
        if (cartData) {
          fetchMatchedBooks(db, cartData);
        }
      });
    }
  }, [user]);

  const fetchMatchedBooks = (db, cartData) => {
    const booksRef = ref(db, 'UploadBooks');
    onValue(booksRef, (snapshot) => {
      const booksData = snapshot.val();
      if (booksData) {
        const matchedBooks = Object.entries(booksData)
          .filter(([bookId, bookData]) => {
            return cartData.hasOwnProperty(bookId);
          })
          .map(([bookId, bookData]) => ({ ...bookData, id: bookId })); // Include 'id' property
        setMatchedBooks(matchedBooks);
        // Initialize timeSelect state with default values for each book
        const initialTimeSelect = matchedBooks.reduce((acc, book) => {
          acc[book.id] = 1; // Set default timeSelect to 1 for each book
          return acc;
        }, {});
        setTimeSelect(initialTimeSelect);
      }
    }, (error) => {
      console.log('Error fetching books:', error);
    });
  };

  const handleTimeSelectChange = (e, bookId) => {
    const updatedTimeSelect = { ...timeSelect, [bookId]: e.target.value };
    setTimeSelect(updatedTimeSelect);
  };

  useEffect(() => {
    // Calculate subtotal
    const subTotal = matchedBooks.reduce(
      (acc, book) => acc + book.price * timeSelect[book.id],
      0
    );
    setSubtotal(subTotal.toFixed(2));

    // Calculate discount
    const discountAmount = subTotal * 0.1;
    setDiscount(discountAmount.toFixed(2));

    // Calculate total
    const totalAmount = subTotal - discountAmount;
    setTotal(totalAmount);

    // const conversionRate = 0.00028; // 1 UGX = 0.00028 USD
    const conversion = convertUGXtoUSD(total).toFixed(2);
    setTotalInUSD(conversion);

  }, [matchedBooks, timeSelect, total]);

  const handleConfirmOrder = (transactionId) => {
    if (user) {
      const db = getDatabase(app);
  
      matchedBooks.forEach((book) => {
        const bookRef = ref(db, `ConfirmOrders/${user.uid}/${book.id}`);
  
        // Get the book data from ConfirmOrders
        get(bookRef)
          .then((snapshot) => {
            const orderData = snapshot.val();
            if (orderData && orderData.time) {
              const borrowTimeMultiplier = getBorrowTimeMultiplier(book.borrowTime.label);
              let existingBorrowTime = parseFloat(orderData.borrowTime) || 0;
              const newBorrowTime = parseFloat(timeSelect[book.id]) + existingBorrowTime;
              const order = {
                ...orderData, // Keep existing fields
                bookId: book.id,
                borrowTime: newBorrowTime,
                borrowTimeMultiplier: borrowTimeMultiplier,
                borrowTimePeriod: book.borrowTime.label,
                bookPrice: book.price,
                time: orderData.time, // Retain the existing time value
                transactionId: transactionId, // Add the transactionId field
              };
  
              set(bookRef, order)
                .then(() => {
                  console.log(`Book with ID ${book.id} added/updated in ConfirmOrders`);
                })
                .catch((error) => {
                  console.error(`Error adding/updating book with ID ${book.id} in ConfirmOrders:`, error);
                });
            } else {
              const borrowTimeMultiplier = getBorrowTimeMultiplier(book.borrowTime.label);
              const order = {
                UserId: user.uid,
                BookId: book.id,
                bookName: book.booktitle,
                borrowTime: parseFloat(timeSelect[book.id]),
                borrowTimeMultiplier: borrowTimeMultiplier,
                borrowTimePeriod: book.borrowTime.label,
                bookPrice: book.price,
                time: Date.now(),
                transactionId: transactionId, // Add the transactionId field
              };
  
              set(bookRef, order)
                .then(() => {
                  console.log(`Book with ID ${book.id} added/updated in ConfirmOrders`);
                })
                .catch((error) => {
                  console.error(`Error adding/updating book with ID ${book.id} in ConfirmOrders:`, error);
                });
            }
          })
          .catch((error) => {
            console.error(`Error retrieving book with ID ${book.id} from ConfirmOrders:`, error);
          });
      });

      // Create a new transaction object
    const transaction = {
      UserId: user.uid,
      PaymentId: transactionId,
      time: Date.now(),
      totalPayment: totalInUSD,
      books: matchedBooks.reduce((acc, book) => {
        acc[book.id] = {
          booktitle: book.booktitle,
          borrowTime: `${timeSelect[book.id]}`,
          borrowTimePeriod: `${book.borrowTime.label}`,
          price: book.price
        };
        return acc;
      }, {})
    };

    // Add the transaction to the "transactions" location with the unique transactionId
    set(ref(db, `transactions/${transactionId}`), transaction)
      .then(() => {
        console.log(`Transaction with ID ${transactionId} added to transactions`);
      })
      .catch((error) => {
        console.error(`Error adding transaction with ID ${transactionId} to transactions:`, error);
      });
  
      remove(ref(db, `Carts/${user.uid}`))
        .then(() => {
          console.log('All Books Removed from Carts');
          off(ref(db, `Carts/${user.uid}`));
        })
        .catch((error) => {
          console.error('Error removing field from the database:', error);
        });
  
      navigate('/my-books');
    }
  };


  

  useEffect(() => {
    const modifiedBooksData = matchedBooks.map((book) => ({
      bookId: book.id,
      booktitle: book.booktitle,
      price: book.price,
      borrowTime: timeSelect[book.id],
      borrowTimePeriod: book.borrowTime.label,
      time: Date.now(),
    }));

    setBooksData(modifiedBooksData);
  }, [matchedBooks, timeSelect]);
  
  return (
    <>
    <div className='max-w-5xl mx-auto pt-6 pb-10'>
      <BackandHeading topHeading={'Cart'} />
      <div className='px-4 py-8 rounded-xl border border-gray-400 mb-8'>
        <h1 className='text-3xl font-bold tracking-wider'>Items</h1>
        <hr className='my-3' />

        {matchedBooks.length === 0 ? (
          <div>No books in Cart yet.</div>
        ) : (
          <ul className='space-y-4'>
            {matchedBooks.map((book) => (
              <li key={book.id} className='flex space-x-4 md:space-x-8'>
                <div className='flex w-40 h-52 overflow-hidden border-[1px] border-gray-300 rounded-xl'>
                  <img src={book.bookCoverURL} alt={book.booktitle} className='w-full' />
                </div>
                <div className='flex flex-col justify-between mb-2'>
                  <div>
                    <Link to={`/book/${book.id}`}>
                      <h1 className='my-2 text-2xl font-bold tracking-wider capitalize'>{book.booktitle}</h1>
                    </Link>
                    <h2 className='my-2 text-lg font-semibold tracking-wider'>by {book.author}</h2>
                    <h1 className='my-2 text-2xl font-semibold tracking-wider'>UGX {book.price} / {book.borrowTime.label}</h1>
                  </div>
                  <div className='flex space-x-8'>
                    <div className='rounded-md border-[1.5px] border-gray-400 px-3 space-x-2 flex items-center'>
                      <input
                        type='text'
                        className='border-l-0 border-b-0 border-t-0 border-r-[1.5px] border-gray-400 pr-3 py-1 h-full flex justify-center items-center focus:border-gray-400 focus:ring-0 focus:outline-none w-16 -ml-2'
                        maxLength={2}
                        value={timeSelect[book.id] || ''}
                        onChange={(e) => handleTimeSelectChange(e, book.id)}
                      />
                      <div className='h-full flex justify-center items-center'>{book.borrowTime.label}</div>
                    </div>
                    <RemoveButton id={book.id} bookName={book.booktitle} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {matchedBooks.length === 0 ? (
      <></>
      ) : (
      <>
      <div className='px-4 py-8 rounded-xl border border-gray-400 mb-8'>
            <h1 className='text-3xl font-bold tracking-wider'>Price Details</h1>
             <hr className='my-3' />

             {matchedBooks.map((book) => (
              <div key={book.id} className='flex justify-between'>
                <span className='text-lg font-semibold tracking-wider w-[60%]'>{book.booktitle}</span>
                <span className='text-lg font-semibold tracking-wider w-[10%]'>
                  {timeSelect[book.id]} {book.borrowTime.label}
                </span>
                <span className='text-lg font-semibold tracking-wider w-[30%] text-right'>UGX {book.price}</span>
              </div>
            ))}

            <hr className='my-3' />
            <div className='flex justify-between'>
              <span className='text-lg font-semibold tracking-wider'>SubTotal</span>
              <span className='text-lg font-semibold tracking-wider'>
                UGX {subtotal}
              </span>
            </div>

            <div className='flex justify-between'>
              <span className='text-lg font-semibold tracking-wider'>Discount (10%)</span>
              <span className='text-lg font-semibold tracking-wider'>UGX {discount}
              </span>
            </div>

            <hr className='my-3' />
            <div className='flex justify-between'>
              <span className='text-lg font-semibold tracking-wider'>Total</span>
              <span className='text-lg font-semibold tracking-wider'>
                UGX {total}
              </span>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <span className='text-lg font-semibold tracking-wider'>Total In USD</span>
                {totalInUSD > 1 ? null : <span className='text-sm text-red-600 -mt-2 font-semibold'>total amount must be minimun of 1 USD</span>}
              </div>
              <span className='text-lg font-semibold tracking-wider'>
                USD {totalInUSD}
              </span>
            </div>
          </div>
          <div className='flex justify-between items-center px-4 py-8 rounded-xl border border-gray-400 mb-8'>
            <h1 className='text-2xl font-bold tracking-wider'>Total Amount : {totalInUSD} USD </h1>
            <PaymentModal amountInUSD={totalInUSD} isAmountValid={totalInUSD < 1}
              onPaymentSuccess={handleConfirmOrder} booksData={booksData} />
          </div>
          </>
          )}
    </div>
    </>
  );
};

export default Cart;
