import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import { calculateTimeLeft } from './utils/Functions';
import { app } from '../context/firebase';

const ReturnRequest = () => {
    const [returnRequest, setReturnRequests] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [booksData, setBooksData] = useState({});
    const db = getDatabase(app);

    useEffect(() => {
        const confirmOrdersRef = ref(db, 'ConfirmOrders');
        const usersRef = ref(db, 'users');
        const booksRef = ref(db, 'UploadBooks');

        onValue(confirmOrdersRef, (snapshot) => {
            const confirmOrdersData = snapshot.val();
            if (confirmOrdersData) {
                const returnRequestsList = [];

                Object.entries(confirmOrdersData).forEach(([userId, userConfirmOrders]) => {
                    Object.entries(userConfirmOrders).forEach(([bookId, confirmOrder]) => {
                        if (confirmOrder.return) {
                            const returnRequest = {
                                userId,
                                bookId,
                                returnTime: confirmOrder.returnTime,
                                time: confirmOrder.time,
                                borrowTime: confirmOrder.borrowTime,
                                borrowTimeMultiplier: confirmOrder.borrowTimeMultiplier,
                                borrowTimePeriod: confirmOrder.borrowTimePeriod,
                            };
                            returnRequestsList.push(returnRequest);
                        }
                    });
                });

                setReturnRequests(returnRequestsList);
            }
        });

        onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                setUsersData(usersData);
            }
        });

        onValue(booksRef, (snapshot) => {
            const booksData = snapshot.val();
            if (booksData) {
                setBooksData(booksData);
            }
        });
    }, [db]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDay = day.toString().padStart(2, '0');
        const formattedMonth = month.toString().padStart(2, '0');

        return `${formattedDay}-${formattedMonth}-${year}`;
    };

    const getUserInfo = (userId) => {
        const user = usersData[userId];
        if (user) {
            return (
                <div>
                    {user.firstName ? <p>Name: {user.firstName} {user.lastName}</p> : <></>}
                    <p>Email: {user.email}</p>
                </div>
            );
        }
        return null;
    };

    const getBookTitle = (bookId) => {
        const book = booksData[bookId];
        if (book) {
            return <p>Book : {book.booktitle}</p>;
        }
        return null;
    };



    const handleApprove = (request) => {
        const { userId, bookId } = request;

        // Remove the 'return' field from the ConfirmOrders node
        const confirmOrderRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
        const updates = {
            return: null,
            returnTime: null,
            time: null,
        };

        update(confirmOrderRef, updates)
            .then(() => {
                console.log('Return field removed from ConfirmOrders.');
            })
            .catch((error) => {
                console.error('Error removing return field from ConfirmOrders:', error);
            });

        // Set the data in the Notifications node
        const notificationId = generateUniqueNotificationId();
        const notificationRef = ref(db, `Notifications/${userId}/${notificationId}`);
        const notificationData = {
            userId: userId,
            bookId: bookId,
            notificationId,
            return: true,
            mark: false,
            time: Date.now(),
        };


        // Update the UploadBooks node with the return field
        // const uploadBookRef = ref(db, `UploadBooks/${bookId}`);
        // const uploadBookUpdates = {
        //     return: {
        //         userId: userId,
        //         time: Date.now(),
        //     },
        // };

        // update(uploadBookRef, uploadBookUpdates)
        //     .then(() => {
        //         console.log('Return field added to UploadBooks.');
        //     })
        //     .catch((error) => {
        //         console.error('Error adding return field to UploadBooks:', error);
        //     });


        set(notificationRef, notificationData)
            .then(() => {
                console.log('Data successfully set in the Notifications node.');
            })
            .catch((error) => {
                console.error('Error setting data in the Notifications node:', error);
            });
    };


    const handleDecline = (request) => {
        const { userId, bookId } = request;

        // Remove the 'return' field from the ConfirmOrders node
        const confirmOrderRef = ref(db, `ConfirmOrders/${userId}/${bookId}`);
        const updates = {
            return: null,
            returnTime: null,
        };

        update(confirmOrderRef, updates)
            .then(() => {
                console.log('Return field removed from ConfirmOrders.');
            })
            .catch((error) => {
                console.error('Error removing return field from ConfirmOrders:', error);
            });


        // Generate a unique notification ID
        const notificationId = generateUniqueNotificationId();


        // Set the data in the database
        const notificationRef = ref(db, `Notifications/${userId}/${notificationId}`);
        const notificationData = {
            userId: userId,
            notificationId,
            bookId: bookId,
            return: false,
            mark: false,
            time: Date.now(),
        };
        set(notificationRef, notificationData)
            .then(() => {
                console.log('Data successfully set in the database.');
            })
            .catch((error) => {
                console.error('Error setting data in the database:', error);
            });
    };

    const generateUniqueNotificationId = () => {
        // Generate a unique ID using the current timestamp
        return Date.now().toString();
    };



    return (
        <div className='my-4 border-t border-gray-300 py-4'>
            <h1 className='text-2xl font-bold'>{returnRequest.length > 0 ? <>Return Requests : {returnRequest.length}</> : 'No Return Requests'}</h1>
            {returnRequest.length > 0 ? (
                returnRequest.map((request, index) => (
                    <div key={index} className='border px-4 py-3 rounded-xl my-4'>
                        {/* <p>User ID: {request.userId}</p> */}
                        {getUserInfo(request.userId)}
                        {/* <p>Book ID: {request.bookId}</p> */}
                        {getBookTitle(request.bookId)}
                        <p>Purchase Date: {formatTimestamp(request.time)}</p>
                        <p>Borrow Time: {request.borrowTime} - {request.borrowTimePeriod} </p>
                        <p>Return Date: {formatTimestamp(request.returnTime)}</p>
                        <p>Time Left: {calculateTimeLeft(request)}</p>
                        <div className='flex space-x-4 my-2'>
                            <button
                                className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:bg-[#DE1212] hover:text-white font-semibold w-fit text-base'
                                onClick={() => handleDecline(request)}
                            >
                                Decline
                            </button>
                            <button
                                className='px-8 py-1 rounded-3xl border-2 border-[#DE1212] hover:border-[#980e0e] bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold w-fit text-base'
                                onClick={() => handleApprove(request)}
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
        </div>
    );
};

export default ReturnRequest;
