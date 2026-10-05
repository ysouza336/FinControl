import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/global.scss";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { ReceitasProvider } from "./contexts/ReceitasContext";
import { DespesasProvider } from "./contexts/DespesasContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ReceitasProvider>
        <DespesasProvider>
          <App />
        </DespesasProvider>
      </ReceitasProvider>
    </AuthProvider>
  </React.StrictMode>
);