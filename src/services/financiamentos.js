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

export function obterReferenciaFinanciamentos(uid) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  return collection(
    db,
    "users",
    uid,
    "financiamentos"
  );
}

export function obterReferenciaFinanciamento(
  uid,
  financiamentoId
) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  if (!financiamentoId) {
    throw new Error(
      "ID do financiamento não informado."
    );
  }

  return doc(
    db,
    "users",
    uid,
    "financiamentos",
    financiamentoId
  );
}

export async function salvarFinanciamento(
  uid,
  dadosFinanciamento
) {
  const referencia =
    obterReferenciaFinanciamentos(uid);

  const dados = {
    ...dadosFinanciamento,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };

  const documento = await addDoc(
    referencia,
    dados
  );

  return {
    id: documento.id,
    ...dadosFinanciamento,
  };
}

export async function buscarFinanciamentos(uid) {
  const referencia =
    obterReferenciaFinanciamentos(uid);

  const consulta = query(
    referencia,
    orderBy("primeiraParcela", "asc")
  );

  const snapshot = await getDocs(consulta);

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

export async function buscarFinanciamento(
  uid,
  financiamentoId
) {
  const referencia =
    obterReferenciaFinanciamento(
      uid,
      financiamentoId
    );

  const snapshot =
    await getDoc(referencia);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function atualizarFinanciamento(
  uid,
  financiamentoId,
  dadosFinanciamento
) {
  const referencia =
    obterReferenciaFinanciamento(
      uid,
      financiamentoId
    );

  const dados = {
    ...dadosFinanciamento,
    atualizadoEm: serverTimestamp(),
  };

  await updateDoc(
    referencia,
    dados
  );

  return {
    id: financiamentoId,
    ...dadosFinanciamento,
  };
}

export async function excluirFinanciamento(
  uid,
  financiamentoId
) {
  const referencia =
    obterReferenciaFinanciamento(
      uid,
      financiamentoId
    );

  await deleteDoc(referencia);

  return true;
}