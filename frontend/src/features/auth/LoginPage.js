import { Form, redirect, useActionData, useRouteLoaderData, useSearchParams } from "react-router-dom";
import InlineLink from "../../components/InlineLink/InlineLink";
import globalStyles from "../../App.module.css";
import GoogleAuthButton from "./GoogleAuthButton";

export async function loginAction({ request }) {
  console.log(`attempting login to ${process.env.REACT_APP_API_BASE_URL}/auth/login`);
  // https://reactrouter.com/en/main/start/tutorial#data-writes--html-forms
  // https://reactrouter.com/en/main/route/action
  let formData = await request.formData();
  try {
    const email = formData.get("email_address");
    const password = formData.get("password");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      }
    );

    if (res.ok) {
      console.log(`Login Successful:`);
      let redirectPath = new URL(request.url).searchParams.get("redirect");
      if (redirectPath) {
        if (redirectPath[0] !== "/") {
          // Prevent external navigation
          redirectPath = `/${redirectPath}`;
        }
      } else {
        redirectPath = "/account";
      }
      return redirect(redirectPath);

    } else if (res.status === 401) {
      return "Login failed. The username or password is incorrect.";
    }
    throw new Error("Unexpected status code.");
  } catch (error) {
    return "Sorry, login failed. Please try again later.";
  }
}


export function LoginPage() {
  // https://reactrouter.com/en/main/components/form
  // https://reactrouter.com/en/main/hooks/use-action-data
  // https://reactrouter.com/en/main/hooks/use-route-loader-data
  const authData = useRouteLoaderData("app");
  const loginError = useActionData();
  const [searchParams] = useSearchParams();
  const isGoogleError = searchParams.get("googleAuthError");

  const registerLink = <InlineLink path="/register" anchor="register" />;
  const loggedOutContent = <>If you haven't created an account, please {registerLink} first or sign in with Google below.</>;
  const loggedInContent = <>You are already logged in as {authData.email_address}.</>;
  const googleError = <>Sign in with Google failed. Please try again later or {registerLink} instead.</>;
console.log(`HELLO`);
console.log(`attempting login to ${process.env.REACT_APP_API_BASE_URL}/auth/login`);
  return (
    <div className={`${globalStyles.pagePadding} ${globalStyles.mw80rem}`}>
      <h1 className={globalStyles.h1}>Log in</h1>
      <p className={globalStyles.mb2rem}>{authData.logged_in ? loggedInContent : loggedOutContent}</p>
      <Form method="post" className={globalStyles.stackedForm}>
        <label htmlFor="email_address" className={globalStyles.label}>Email</label>
        <input id="email_address" className={globalStyles.input} type="email" name="email_address" required />
        <label htmlFor="password" className={globalStyles.label}>Password</label>
        <input id="password" className={globalStyles.input} type="password" name="password" required />
        <button type="submit" className={globalStyles.button}>Log in</button>
      </Form>
      <p>{loginError ? loginError : null}</p>
      <hr className={globalStyles.separator} />
      <GoogleAuthButton />
      <p>{isGoogleError ? googleError : null}</p>
    </div>
  );
}