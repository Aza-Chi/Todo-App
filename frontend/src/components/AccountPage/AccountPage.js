import { useRouteLoaderData } from "react-router-dom";

import InlineErrorPage from "../InlineErrorPage/InlineErrorPage";
import InlineLink from "../InlineLink/InlineLink";
//import styles from "./AccountPage.module.css";
import styles from "../../App.module.css";


export default function AccountPage() {
  const authData = useRouteLoaderData("app");
  console.log(`AccountPage.js - authData: logged in? ${authData.logged_in}`);

  if (!authData || !authData.logged_in) {
    //console.log('AccountPage.js - authData: not logged in!', authData);
    console.log(("Checking if !authData.logged_in, it should be true"));
    console.log((!authData.logged_in)); //true then returns this fail page 
    return <InlineErrorPage pageName="Your account" type="login_required" />;
    

  } else if (authData.logged_in)   {
    console.log('AccountPage.js - authData: logged in!', authData);
    return (
      <div className={styles.pagePadding}>
        <h1 className={styles.h1}>Account information:</h1>
        <p className={styles.p}>Welcome {authData.name}.</p>
        <p className={styles.p}>You are logged in as {authData.username}/{authData.email_address}.</p>
        
        <p className={styles.mb3rem}>
          Change your account information below or <InlineLink path="/todo" anchor="view your todo list(s)" />.
        </p>
        
        {/* <h2>Friends:</h2> */}
      </div>
    );
  }

}