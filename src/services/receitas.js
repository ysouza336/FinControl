import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

/**
 * Retorna a referência da coleção de receitas
 * pertencente ao usuário autenticado.
 */
export function obterReferenciaReceitas(uid) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  return collection(db, "users", uid, "receitas");
}

/**
 * Retorna a referência de uma receita específica.
 */
export function obterReferenciaReceita(uid, receitaId) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  if (!receitaId) {
    throw new Error("ID da receita não informado.");
  }

  return doc(db, "users", uid, "receitas", receitaId);
}

/**
 * Salva uma nova receita no Firestore.
 */
export async function salvarReceita(uid, dadosReceita) {
  const referencia = obterReferenciaReceitas(uid);

  const dados = {
    ...dadosReceita,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };

  const documento = await addDoc(referencia, dados);

  return {
    id: documento.id,
    ...dadosReceita,
  };
}

/**
 * Busca todas as receitas do usuário.
 */
export async function buscarReceitas(uid) {
  const referencia = obterReferenciaReceitas(uid);

  const consulta = query(
    referencia,
    orderBy("data", "desc")
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}

/**
 * Busca uma receita específica.
 */
export async function buscarReceita(uid, receitaId) {
  const referencia = obterReferenciaReceita(uid, receitaId);

  const snapshot = await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/**
 * Atualiza uma receita existente.
 */
export async function atualizarReceita(
  uid,
  receitaId,
  dadosReceita
) {
  const referencia = obterReferenciaReceita(uid, receitaId);

  const dados = {
    ...dadosReceita,
    atualizadoEm: serverTimestamp(),
  };

  await updateDoc(referencia, dados);

  return {
    id: receitaId,
    ...dadosReceita,
  };
}

/**
 * Exclui uma receita.
 */
export async function excluirReceita(uid, receitaId) {
  const referencia = obterReferenciaReceita(uid, receitaId);

  await deleteDoc(referencia);

  return true;
}