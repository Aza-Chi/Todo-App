import globalStyles from './App.module.css';
import { Outlet } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import Header from "./components/Header/Header";
import { getStatus } from './features/auth/utils';

export async function authLoader() {
  
return await getStatus();

}

export function App() {
  

  // if (!authData.logged_in) {
  //   return (
  //     <div className="App">
  //   {/* <InlineErrorPage pageName="Your account" type="login_required" /> */}
  //   <LoginPage />
  //   </div>

  // );
  // }


  return (
    <div className="App">
      <Header />
      <main>
        {/* <LoginPage/>  */}
        {/* LoginPage component to be removed when login functionality added */}
        <Outlet />
      </main>
    </div>
  );
}