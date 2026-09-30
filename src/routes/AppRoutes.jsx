import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/MainLayout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard/Dashboard";
import Receitas from "../pages/Receitas/Receitas";
import Despesas from "../pages/Despesas/Despesas";
import Financiamento from "../pages/Financiamento/Financiamento";
import Relatorios from "../pages/Relatorios/Relatorios";
import Configuracoes from "../pages/Configuracoes/Configuracoes";
import Login from "../pages/Login/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/despesas" element={<Despesas />} />
            <Route path="/financiamento" element={<Financiamento />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;