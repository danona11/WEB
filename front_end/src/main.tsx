import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error CSS is loaded by the bundler at runtime.

import './index.css'
import App from './App.tsx'
import ContextProvider from './context/ContextProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <ContextProvider>
    <App />
  </ContextProvider>
)