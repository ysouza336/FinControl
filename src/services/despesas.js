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

export function obterReferenciaDespesas(uid) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  return collection(
    db,
    "users",
    uid,
    "despesas"
  );
}

export function obterReferenciaDespesa(
  uid,
  despesaId
) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  if (!despesaId) {
    throw new Error("ID da despesa não informado.");
  }

  return doc(
    db,
    "users",
    uid,
    "despesas",
    despesaId
  );
}

export async function salvarDespesa(
  uid,
  dadosDespesa
) {
  const referencia =
    obterReferenciaDespesas(uid);

  const dados = {
    ...dadosDespesa,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };

  const documento = await addDoc(
    referencia,
    dados
  );

  return {
    id: documento.id,
    ...dadosDespesa,
  };
}

export async function buscarDespesas(uid) {
  const referencia =
    obterReferenciaDespesas(uid);

  const consulta = query(
    referencia,
    orderBy("data", "desc")
  );

  const snapshot = await getDocs(
    consulta
  );

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

export async function buscarDespesa(
  uid,
  despesaId
) {
  const referencia =
    obterReferenciaDespesa(
      uid,
      despesaId
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

export async function atualizarDespesa(
  uid,
  despesaId,
  dadosDespesa
) {
  const referencia =
    obterReferenciaDespesa(
      uid,
      despesaId
    );

  const dados = {
    ...dadosDespesa,
    atualizadoEm: serverTimestamp(),
  };

  await updateDoc(
    referencia,
    dados
  );

  return {
    id: despesaId,
    ...dadosDespesa,
  };
}

export async function excluirDespesa(
  uid,
  despesaId
) {
  const referencia =
    obterReferenciaDespesa(
      uid,
      despesaId
    );

  await deleteDoc(referencia);

  return true;
}