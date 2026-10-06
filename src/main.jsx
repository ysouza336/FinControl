import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/global.scss";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { ReceitasProvider } from "./contexts/ReceitasContext";
import { DespesasProvider } from "./contexts/DespesasContext";
import {
  FinanciamentosProvider,
} from "./contexts/FinanciamentosContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ReceitasProvider>
      <DespesasProvider>
        <FinanciamentosProvider>
          <App />
        </FinanciamentosProvider>
      </DespesasProvider>
    </ReceitasProvider>
  </AuthProvider>
);