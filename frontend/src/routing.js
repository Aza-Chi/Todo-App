import { createBrowserRouter } from "react-router-dom";
import { App, authLoader } from "./App";
import FallbackErrorPage from "./components/ErrorPage/ErrorPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
// import {
//   RegistrationPage,
//   registerAction,
// } from "./features/auth/RegistrationPage";
// import AccountPage from "./components/AccountPage/AccountPage";
// import { TodoFeed, todoFeedLoader } from "./features/products/ProductFeed";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <FallbackErrorPage />,
    loader: authLoader,
    id: "app",
    children: [
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
    //   {
    //     path: "register",
    //     element: <RegistrationPage />,
    //     action: registerAction,
    //   },
    //   {
    //     path: "account",
    //     element: <AccountPage />,
    //     // loader: ,
    //   },
    //   {
    //     path: "",
    //     element: <ListFeed />,
    //     loader: listFeedLoader,
    //   },
      
    ],
  },
]);
