import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ReduxStore } from './ReduxStore/ReduxStore'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={ReduxStore}>
          <App />
      </Provider>
  </StrictMode>
    
)