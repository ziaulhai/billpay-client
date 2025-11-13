import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { router } from './routes/Routes.jsx' // Make sure you have this file
import { RouterProvider } from 'react-router-dom'
import AuthContextProvider from './AuthProvider.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
)