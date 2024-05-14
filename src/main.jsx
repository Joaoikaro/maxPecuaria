import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main';
import LoginPage from './pages/Login';
import Empresas from './pages/Empresas';
import Contrato from './pages/Contrato';
import Carga from './pages/Carga';

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
    path: "/Main",
    element: <Main />
  },
  {
    path: "/main",
    element: <Main />
  },
  {
    path: "/empresas",
    element: <Empresas />
  },
  {
    path: "/dashboard",
    element: <Main />
  },
  {
    path: "/Dashboard",
    element: <Main />
  },
  {
   path: "/dashboards",
   element: <Main />
  },
  {
   path: "/Dashboards",
   element: <Main />
  },
  {
    path: "/fluxo-de-caixa",
    element: <Main />
  },
  {
    path: "/Fluxo-de-caixa",
    element: <Main />
  },
  {
    path: "/fluxo",
    element: <Main />
   },
   {
    path: "/cargas",
    element: <Carga />
   },
   {
    path: "/Contrato",
    element: <Contrato />
   },
   {
    path: "/contratos",
    element: <Contrato />
   },
   {
    path: "/Contrato",
    element: <Contrato />
   },
   {
    path: "/contrato",
    element: <Contrato />
   },
   {
    path: "/Contrato",
    element: <Contrato />
   },
   {
    path: "/carga",
    element: <Carga />
   },
   {
    path: "/Carga",
    element: <Carga />
   },
   {
    path: "/cargas",
    element: <Carga />
   },
   {
    path: "/cargas-contratos",
    element: <Contrato />
   },
   {
    path: "/cargas-e-contratos",
    element: <Carga />
   },
   {
    path: "/contratos-e-cargas",
    element: <Contrato />
   },
   {
    path: "/contratos-cargas",
    element: <Contrato />
   }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
