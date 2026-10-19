import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import ContextProvider from './context/ContextProvider'


createRoot(document.getElementById('root')!).render(
  <ContextProvider>
    <App />
  </ContextProvider>
)


// validate the user has a cookie - if not send to unauth user