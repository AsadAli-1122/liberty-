import { getDatabase, push, ref, set } from 'firebase/database';
import { app } from '../../context/firebase';


export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Month is zero-based, so we add 1
  const year = date.getFullYear();

  // Pad single-digit day/month with leading zero if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}-${formattedMonth}-${year}`;
}



export function calculateTimeLeft(order) {
  const currentTime = Date.now();
  const borrowTimeInMillis = order.borrowTime * order.borrowTimeMultiplier * 24 * 60 * 60 * 1000;
  const endTime = order.time + borrowTimeInMillis;
  const timeLeftInMillis = endTime - currentTime;

  // Convert milliseconds to days
  const timeLeftInDays = Math.ceil(timeLeftInMillis / (24 * 60 * 60 * 1000));
  const formattedTimeLeft = timeLeftInDays - 1; // Subtracting 1 day from the total time left

  return formattedTimeLeft;
}


export const getBorrowTimeMultiplier = (borrowTimePeriod) => {
  if (borrowTimePeriod === 'Days') {
    return 1;
  } else if (borrowTimePeriod === 'Weeks') {
    return 7;
  } else if (borrowTimePeriod === 'Months') {
    return 30;
  } else {
    return 1; 
  }
};


export const SuccessPurchaseNotification = ({ userId, otherDetails }) => {
  const db = getDatabase(app);

  // Create a reference to the Notifications collection
  const notificationsRef = ref(db, `Notifications`);

  // Generate a new key for the notification
  const newNotificationKey = push(notificationsRef).key;

  // Create the notification data
  const notificationData = {
    userId: userId,
    otherDetails: otherDetails,
  };

  // Save the notification data to the database
  set(ref(db, `Notifications/${newNotificationKey}`), notificationData)
    .then(() => {
      console.log('Notification data saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving notification data:', error);
    });

  // Rest of your code...
};

