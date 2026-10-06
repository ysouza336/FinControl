import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export function obterReferenciaParcelas(
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

  return collection(
    db,
    "users",
    uid,
    "financiamentos",
    financiamentoId,
    "parcelas"
  );
}

export async function salvarParcela(
  uid,
  financiamentoId,
  dadosParcela
) {
  const referencia =
    obterReferenciaParcelas(
      uid,
      financiamentoId
    );

  const dados = {
    ...dadosParcela,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  };

  const documento = await addDoc(
    referencia,
    dados
  );

  return {
    id: documento.id,
    ...dadosParcela,
  };
}

export async function buscarParcelas(
  uid,
  financiamentoId
) {
  const referencia =
    obterReferenciaParcelas(
      uid,
      financiamentoId
    );

  const consulta = query(
    referencia,
    orderBy("numero", "asc")
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

export async function atualizarParcela(
  uid,
  financiamentoId,
  parcelaId,
  dadosParcela
) {
  if (!uid) {
    throw new Error("UID do usuário não informado.");
  }

  if (!financiamentoId) {
    throw new Error(
      "ID do financiamento não informado."
    );
  }

  if (!parcelaId) {
    throw new Error(
      "ID da parcela não informado."
    );
  }

  const referencia = doc(
    db,
    "users",
    uid,
    "financiamentos",
    financiamentoId,
    "parcelas",
    parcelaId
  );

  const dados = {
    ...dadosParcela,
    atualizadoEm: serverTimestamp(),
  };

  await updateDoc(
    referencia,
    dados
  );

  return {
    id: parcelaId,
    ...dadosParcela,
  };
}

function obterDataParcela(
  dataInicial,
  indice
) {
  const ano = dataInicial.getFullYear();
  const mes =
    dataInicial.getMonth() + indice;
  const dia = dataInicial.getDate();

  const ultimoDiaDoMes = new Date(
    ano,
    mes + 1,
    0
  ).getDate();

  const diaFinal = Math.min(
    dia,
    ultimoDiaDoMes
  );

  return new Date(
    ano,
    mes,
    diaFinal,
    12,
    0,
    0
  );
}

export async function gerarParcelas(
  uid,
  financiamentoId,
  quantidadeParcelas,
  valorParcela,
  primeiraParcela
) {
  if (
    !quantidadeParcelas ||
    quantidadeParcelas <= 0
  ) {
    throw new Error(
      "Quantidade de parcelas inválida."
    );
  }

  if (
    !valorParcela ||
    valorParcela <= 0
  ) {
    throw new Error(
      "Valor da parcela inválido."
    );
  }

  if (!primeiraParcela) {
    throw new Error(
      "Data da primeira parcela não informada."
    );
  }

  const quantidade =
    Number(quantidadeParcelas);

  const valor = Number(valorParcela);

  if (
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    throw new Error(
      "A quantidade de parcelas deve ser um número inteiro maior que zero."
    );
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error(
      "O valor da parcela deve ser maior que zero."
    );
  }

  const dataInicial = new Date(
    `${primeiraParcela}T12:00:00`
  );

  if (
    Number.isNaN(
      dataInicial.getTime()
    )
  ) {
    throw new Error(
      "Data da primeira parcela inválida."
    );
  }

  const parcelasCriadas = [];

  for (
    let indice = 0;
    indice < quantidade;
    indice += 1
  ) {
    const dataVencimento =
      obterDataParcela(
        dataInicial,
        indice
      );

    const dadosParcela = {
      numero: indice + 1,
      valor,
      dataVencimento:
        dataVencimento
          .toISOString()
          .split("T")[0],
      status: "pendente",
    };

    const parcelaCriada =
      await salvarParcela(
        uid,
        financiamentoId,
        dadosParcela
      );

    parcelasCriadas.push(
      parcelaCriada
    );
  }

  return parcelasCriadas;
}