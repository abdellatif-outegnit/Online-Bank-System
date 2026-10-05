import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home/Home'
import "./utils/i18n/i18n"
import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from './Pages/Login/Login'
import AuthHeader from "./Components/AuthHeader/AuthHeader"
import Register from './Pages/Register/Register'
import Dashboard from './Pages/Dashboard/Dashboard'

const requireAuth = () => {
  if (!localStorage.getItem("AccessToken")) {
    return redirect("/login");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    element: <AuthHeader/>,
    children : [
      {path : "/login", element: <Login/>}, 
      {path : "/register",  element: <Register/>}, 
    ]
  },
  {
    path : "/dashboard",
    loader: requireAuth,
    element : <Dashboard/>
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
