import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { criarPerfilUsuario } from "../services/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  async function criarConta(email, senha) {
    const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    await criarPerfilUsuario(resultado.user);

    return resultado;
  }

  async function login(email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
  }

  async function logout() {
    return signOut(auth);
  }

  const valor = {
    usuario,
    carregando,
    criarConta,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider.");
  }

  return contexto;
}