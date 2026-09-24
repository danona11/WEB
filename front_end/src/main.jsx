import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'

import Home from './Home.jsx'
import SignUpPage from './SignUpPage.jsx'
import PageNotFound from './PageNotFound.jsx'

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