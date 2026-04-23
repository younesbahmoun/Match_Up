import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from "./app/router/AppRouter";
import './index.css'
import AuthProvider from "@/context/AuthContext";
import { BrowserRouter } from 'react-router-dom';
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* <TestProvider> */}
      {/* <App /> */}
        <AppRouter />
        {/* </TestProvider> */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
