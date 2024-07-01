import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutPage.module.css';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate('/login'); // Replace with your login page route
    }, 10000); //10000 = 10 seconds

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <div className={styles.logoutPage}>
      <div className={styles.message}>
        <h3>You have successfully logged out!</h3>
        <h3>Thank you for using the Todo List App.</h3>
      </div>
    </div>
  );
};

export default LogoutPage;
