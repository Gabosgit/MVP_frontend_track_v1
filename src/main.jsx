import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ApiProvider } from "./context/ApiContext";
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  </StrictMode>,
)
