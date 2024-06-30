import { createBrowserRouter } from "react-router-dom";
import { App, authLoader } from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
import {
  RegisterPage,
  registerAction,
} from "./features/auth/RegisterPage";
import AccountPage from "./components/AccountPage/AccountPage";
// import { TodoFeed, todoFeedLoader } from "./features/products/ProductFeed";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    id: "app",
    children: [
      {
        path: "login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "account",
        element: <AccountPage />,
        // loader: ,
      },
      {
        path: "register",
        element: <RegisterPage />,
        action: registerAction,
      },
    //   {
    //     path: "",
    //     element: <ListFeed />,
    //     loader: listFeedLoader,
    //   },
      
    ],
  },
]);
