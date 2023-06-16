import React, { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
  const { user } = useContext(AuthContext);
  const db = getDatabase();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [booksData, setBooksData] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    if (user && user.uid) {
      // Create a reference to the notifications for the current user
      const notificationsRef = ref(db, `Notifications/${user.uid}`);

      // Fetch the notifications from the database
      onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();

        // Convert the object of notifications into an array
        const notificationsArray = notificationsData
          ? Object.values(notificationsData)
          : [];

        // Set the notifications in the state
        setNotifications(notificationsArray);
      });

      // Create a reference to the books data
      const booksRef = ref(db, "UploadBooks");

      // Fetch the books data from the database
      onValue(booksRef, (snapshot) => {
        const booksData = snapshot.val();
        if (booksData) {
          setBooksData(booksData);
        }
      });

      // Cleanup the event listeners when the component unmounts
      return () => {
        off(notificationsRef);
        off(booksRef);
      };
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [db, user]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.mark
  );

  const getBookTitle = (bookId) => {
    const book = booksData[bookId];
    if (book) {
      return book.booktitle;
    }
    return null;
  };

  return (
    <div className="relative z-20" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-bell text-black"></i>
        {unreadNotifications.length > 0 ? (
          <span className="absolute -mt-6 -mr-4 bg-red-600 rounded-full text-white w-5 h-5 flex justify-center items-center text-xs">
            {unreadNotifications.length}
          </span>
        ) : (
          ""
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg">
          <div className="flex justify-center items-center my-2 font-semibold text-lg tracking-wide border-b-2 mb-2 pb-1 border-gray-300">
            Notifications
          </div>
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="notification-menu"
          >
            <div className="max-h-64 overflow-scroll">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <Link
                    to="/notifications"
                    key={notification.notificationId}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer block"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Book{" "}
                    <span className="font-bold tracking-wide">
                      {getBookTitle(notification.bookId)}
                    </span>
                    <span className="">
                      {notification.lost === undefined && " Lost "}
                      {notification.return === undefined && " Return "}
                      {notification.lost !== undefined ||
                      notification.return !== undefined
                        ? "Request"
                        : ""}
                    </span>{" "}
                    has{" "}
                    <span className="font-bold tracking-wide">
                      {notification.lost !== undefined ||
                        (notification.return ? "Accepted" : "Declined")}
                      {notification.return !== undefined ||
                        (notification.lost ? "Accepted" : "Declined")}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2">No new notifications</div>
              )}
            </div>
            <div className="flex justify-center items-center my-2 border-t-2 pt-2 border-gray-300">
              <Link
                to="/notifications"
                className="px-8 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold tracking-wider text-sm w-fit"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Show All Notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
