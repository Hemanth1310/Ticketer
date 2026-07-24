import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthContextProivder } from './contexts/authContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProivder>
      <App />
    </AuthContextProivder>
  </StrictMode>,
)
