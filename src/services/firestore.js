import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

/**
 * Retorna a referência do documento do usuário.
 */
export function obterReferenciaUsuario(uid) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  return doc(db, "users", uid);
}

/**
 * Cria ou atualiza o perfil básico do usuário.
 */
export async function criarPerfilUsuario(usuario) {
  if (!usuario?.uid) {
    throw new Error("Usuário inválido para criação do perfil.");
  }

  const referencia = obterReferenciaUsuario(usuario.uid);

  const dadosUsuario = {
    uid: usuario.uid,
    email: usuario.email || "",
    nome: usuario.displayName || "",
    atualizadoEm: serverTimestamp(),
  };

  await setDoc(
    referencia,
    dadosUsuario,
    {
      merge: true,
    }
  );

  return dadosUsuario;
}

/**
 * Busca o perfil do usuário.
 */
export async function buscarPerfilUsuario(uid) {
  const referencia = obterReferenciaUsuario(uid);

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}