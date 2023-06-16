import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import { getDatabase, ref as databaseRef, get } from 'firebase/database'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        try {
          const db = getDatabase();
          const userRef = databaseRef(db, `users/${userAuth.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({
              ...userAuth,
              userData // Merge the additional user data from the Realtime Database
            });
          } else {
            setUser(userAuth); // If no additional data exists, set only the user from Authentication
          }
        } catch (error) {
          console.log('Failed to fetch user data:', error);
        }
      } else {
        setUser(null); // If no user is authenticated, set user to null
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, auth }}>
      {children}
    </AuthContext.Provider>
  );
};
