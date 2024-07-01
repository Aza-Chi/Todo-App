import { createBrowserRouter } from "react-router-dom";
import { App, authLoader } from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { LoginPage, loginAction } from "./features/auth/LoginPage";
import { RegisterPage, registerAction } from "./features/auth/RegisterPage";
import AccountPage from "./components/AccountPage/AccountPage";
import TodoListFeed from "./features/TodoLists/TodoListFeed"; 
import { todoListFeedLoader } from "./features/TodoLists/TodoListFeed"; 
import LogoutPage from "./features/auth/LogoutPage";

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
        path: "register",
        element: <RegisterPage />,
        action: registerAction,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: '/todo',
        element: <TodoListFeed />,
        loader: todoListFeedLoader,
      },
      {
        path: '/logout',
        element: <LogoutPage />, 
      },
    ],
  },
]);