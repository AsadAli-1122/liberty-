import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDatabase, ref, onValue, off, update } from "firebase/database";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [booksData, setBooksData] = useState({});
  const [usersData, setUsersData] = useState({});
  const db = getDatabase();

  useEffect(() => {
    if (user && user.uid) {
      // Create a reference to the Notifications node for the current user
      const notificationsRef = ref(db, `Notifications/${user.uid}`);
      const booksRef = ref(db, "UploadBooks");
      const usersRef = ref(db, "users");

      // Fetch the notifications from the database
      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();

         // Fetch the Books data from the database
        onValue(booksRef, (snapshot) => {
          const booksData = snapshot.val();
          if (booksData) {
            setBooksData(booksData);
          }
        });

        
      // Fetch the users data from the database
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          setUsersData(usersData);
        }
      });

        // Convert the object of notifications into an array
        const notificationsArray = notificationsData
          ? Object.values(notificationsData)
          : [];

        // Set the notifications in the state
        setNotifications(notificationsArray);
      });

      // Cleanup the event listener when the component unmounts
      return () => {
        off(notificationsRef);
        off(booksRef);
        off(usersRef);
      };
    }
  }, [db, user]);

  const handleMarkedAll = () => {
    // Update the 'mark' property to true for all notifications
    notifications.forEach((notification) => {
      const notificationRef = ref(
        db,
        `Notifications/${user.uid}/${notification.notificationId}`
      );
      update(notificationRef, {
        mark: true,
      });
    });
  };

  const handleMarked = (notificationId) => {
    // Create a reference to the specific notification in the database
    const notificationRef = ref(
      db,
      `Notifications/${user.uid}/${notificationId}`
    );

    // Update the 'mark' property to true
    update(notificationRef, {
      mark: true,
    });
  };

  const getBookTitle = (bookId) => {
    const book = booksData[bookId];
    if (book) {
      return book.booktitle;
    }
    return null;
  };

  const getUserDetail = (userId) => {
    const user = usersData[userId];
    if (user) {
      if (user.firstName) {
        return (
          <>
            {user.firstName} {user.lastName}
          </>
        );
      } else {
        return <>{user.email}</>;
      }
    }
    return null;
  };

  function convertMillisecondsToTime(milliseconds) {
    const date = new Date(milliseconds);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();

    const formattedTime = `${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${day}-${month}-${year}`;
    return formattedTime;
  }

  return (
    <div className="my-4">
      <div className="flex px-8 justify-between items-center">
        <span className="text-base font-semibold tracking-wider">
          Click Notification to mark as Read
        </span>
        <button
          className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold tracking-wider text-sm w-fit"
          onClick={handleMarkedAll}
        >
          Mark All as Read
        </button>
      </div>
      {notifications.length > 0 ? (
        [...notifications].reverse().map((notification) => (
          <div
            key={notification.notificationId}
            className={`border border-gray-300 mx-4 my-2 px-3 py-1 rounded-xl ${
              notification.mark ? "bg-gray-200" : "bg-gray-400 cursor-pointer"
            }`}
            onClick={() => handleMarked(notification.notificationId)}
          >
            <div className="font-bold tracking-wide flex justify-between">
              <span className="">Reply from Admin : 
                {notification.lost === undefined && " Lost "}
                {notification.return === undefined && " Return "}
                {notification.lost !== undefined ||
                notification.return !== undefined
                  ? "Request"
                  : ""}
              </span>

              <span>{convertMillisecondsToTime(notification.time)}</span>
            </div>
            <p className=" px-4">
              Dear <span className="font-semibold underline-offset-4 underline capitalize">{getUserDetail(notification.userId)}</span>
              {" "}
              Your {notification.lost === undefined && "Lost Request "}
              {notification.return === undefined && "Return Request"} of Book{" "}
              <span className="font-semibold underline-offset-4 underline capitalize">{getBookTitle(notification.bookId)}</span> has been 
              {" "}<span className="font-semibold underline-offset-4 underline capitalize">
              {notification.lost !== undefined || (notification.return ? 'Accepted' : 'Declined')}
              {notification.return !== undefined || (notification.lost ? 'Accepted' : 'Declined')}
              </span>{" "}
               by Admin.
              {notification.lost !== undefined || (notification.return ? '' : ' Please Contact as soon as possible to Librarian. ')}
              {notification.return !== undefined || (notification.lost ? '' : ' Please Contact as soon as possible to Librarian. ')}
            </p>
          </div>
        ))
      ) : (
        <p className="px-8">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;
