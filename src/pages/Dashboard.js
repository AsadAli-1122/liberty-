import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackandHeading from '../components/header/BackandHeading';
import LostRequests from '../components/LostRequests';
import { AuthContext } from '../context/AuthContext';
import ReturnRequest from '../components/ReturnRequest';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!user) {
      // navigate('/login');
    // } else if (user.email !== 'admin@example.com') {
    //   navigate('/');
    // }
  }, [user, navigate]);

  return (
    <div className="max-w-5xl mx-auto">
      <BackandHeading topHeading={'Dashboard'} />
      <LostRequests />
      <ReturnRequest />
    </div>
  );
};

export default Dashboard;
