import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Homepage from './pages/Homepage.tsx';
import NavBarLayout from './components/layouts/NavBarLayout.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<NavBarLayout><Homepage /></NavBarLayout>} />
          <Route path='/login' element={<NavBarLayout><Login /></NavBarLayout>} />
          <Route path='/register' element={<NavBarLayout><Register /></NavBarLayout>} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
