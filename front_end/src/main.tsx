import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

import Home from './Home.js'
import SignUpPage from './SignUpPage.js'
import PageNotFound from './PageNotFound.js'

const router = createBrowserRouter([
  { path: "/", element: <App/> },
  { path: "/home", element: <Home/> },
  { path: "/signUpPage", element: <SignUpPage/> },

  { path: "*", element: <PageNotFound/> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
)  