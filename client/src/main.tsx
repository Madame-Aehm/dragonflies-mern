import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from './pages/Homepage.tsx';
import NavBarLayout from './components/layouts/NavBarLayout.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';
import ProtectedLayout from './components/layouts/ProtectedLayout.tsx';

const router = createBrowserRouter([
  {
    element:  <AuthContextProvider>
                <NavBarLayout />
              </AuthContextProvider>,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        element:  <ProtectedLayout />,
        children: [
          { path: "/profile", element: <Profile /> }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
