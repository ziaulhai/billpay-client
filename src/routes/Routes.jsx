import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root"; 
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import AllBills from "../pages/AllBills/AllBills"; 
import BillDetails from "../pages/BillDetails/BillDetails";
import MyPayBills from "../pages/MyPayBills/MyPayBills";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute"; 


const API_BASE_URL = "https://billpay-server.vercel.app"; 

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/bills",
        // AllBills 
        element: <AllBills />, 
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      // Private Routes 
      {
        path: "/bills/:id",
        element: <ProtectedRoute><BillDetails /></ProtectedRoute>,
       
        loader: ({ params }) => fetch(`${API_BASE_URL}/api/v1/bills/${params.id}`), 
      },
      {
        path: "/mypaybills",
        element: <ProtectedRoute><MyPayBills /></ProtectedRoute>,
      },
    ],
  },
]);