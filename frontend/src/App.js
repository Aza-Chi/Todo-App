import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLoaderData, useLocation } from 'react-router-dom';
import globalStyles from './App.module.css';
import Header from './components/Header/Header';
import { getStatus } from './features/auth/utils'; 

export async function authLoader() {  
return await getStatus();
}

export function App() {
  const authData = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authData.logged_in after navigating to the root route or after redirect
    getStatus();
    if (location.pathname === '/' && authData.logged_in) {
      console.log(`App.js - authData: ${authData.id}`);
      navigate('/todo'); // Redirect to /todo if logged in and navigating to /
    } else if (location.pathname === '/' && !authData.logged_in) {
      console.log(`App.js - authData: ${authData.id}`);
      navigate('/login'); // Redirect to /login if not logged in and navigating to /
    }
  }, [authData, navigate, location.pathname]);

  return (
    <div className={globalStyles.App}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// import { LoginPage } from "./features/auth/LoginPage";

  // if (!authData.logged_in) {
  //   return (
  //     <div className="App">
  //   {/* <InlineErrorPage pageName="Your account" type="login_required" /> */}
  //   <LoginPage />
  //   </div>

  // );
  // }
