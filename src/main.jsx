import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Usuarios from './pages/Usuarios';
import LoginPage from './pages/Login';
import Empresas from './pages/Empresas';
import Inicial from './pages/inicial';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/Login",
    element: <LoginPage/>
  },
  {
    path: "/Entrar",
    element: <LoginPage/>
  },
  {
    path: "/empresa",
    element: <Empresas/>
  },
  {
    path: "/Empresas",
    element: <Empresas />
  },
  {
    path: "/usuarios",
    element: <Usuarios />
  },
  {
    path: '/main',
    element: <Inicial/>
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
