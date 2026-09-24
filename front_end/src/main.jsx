import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './Home.jsx'
import Sign_up_page from './Sign_up_page.jsx'
import Page_not_found from './Page_not_found.jsx'

const router = createBrowserRouter([
  { path: "/", element: <App/> },
  { path: "/home", element: <Home/> },
  { path: "/sign_up_page", element: <Sign_up_page/> },

  { path: "*", element: <Page_not_found/> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
)  