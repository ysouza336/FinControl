import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  atualizarFinanciamento as atualizarFinanciamentoService,
  buscarFinanciamentos,
  excluirFinanciamento as excluirFinanciamentoService,
  salvarFinanciamento as salvarFinanciamentoService,
} from "../services/financiamentos";

import {
  gerarParcelas,
} from "../services/parcelas";

const FinanciamentosContext =
  createContext(null);

export function FinanciamentosProvider({
  children,
}) {
  const {
    usuario,
    carregando: carregandoAuth,
  } = useAuth();

  const [
    financiamentos,
    setFinanciamentos,
  ] = useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  const carregarFinanciamentos =
    useCallback(async () => {
      if (!usuario?.uid) {
        setFinanciamentos([]);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const dados =
          await buscarFinanciamentos(
            usuario.uid
          );

        setFinanciamentos(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar financiamentos:",
          error
        );

        setErro(
          "Não foi possível carregar os financiamentos."
        );
      } finally {
        setCarregando(false);
      }
    }, [usuario?.uid]);

  useEffect(() => {
    if (carregandoAuth) {
      return;
    }

    carregarFinanciamentos();
  }, [
    carregandoAuth,
    carregarFinanciamentos,
  ]);

  async function adicionarFinanciamento(
    dadosFinanciamento
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      const novoFinanciamento =
        await salvarFinanciamentoService(
          usuario.uid,
          dadosFinanciamento
        );

      try {
        await gerarParcelas(
          usuario.uid,
          novoFinanciamento.id,
          Number(
            dadosFinanciamento.quantidadeParcelas
          ),
          Number(
            dadosFinanciamento.valorParcela
          ),
          dadosFinanciamento.primeiraParcela
        );
      } catch (erroParcelas) {
        console.error(
          "Erro ao gerar parcelas:",
          erroParcelas
        );

        setErro(
          "O financiamento foi salvo, mas não foi possível gerar as parcelas."
        );

        throw erroParcelas;
      }

      setFinanciamentos(
        (financiamentosAtuais) => [
          ...financiamentosAtuais,
          novoFinanciamento,
        ]
      );

      return novoFinanciamento;
    } catch (error) {
      console.error(
        "Erro ao adicionar financiamento:",
        error
      );

      if (!erro) {
        setErro(
          "Não foi possível adicionar o financiamento."
        );
      }

      throw error;
    }
  }

  async function editarFinanciamento(
    financiamentoId,
    dadosFinanciamento
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      const financiamentoAtualizado =
        await atualizarFinanciamentoService(
          usuario.uid,
          financiamentoId,
          dadosFinanciamento
        );

      setFinanciamentos(
        (financiamentosAtuais) =>
          financiamentosAtuais.map(
            (financiamento) =>
              financiamento.id ===
              financiamentoId
                ? {
                    ...financiamento,
                    ...financiamentoAtualizado,
                  }
                : financiamento
          )
      );

      return financiamentoAtualizado;
    } catch (error) {
      console.error(
        "Erro ao editar financiamento:",
        error
      );

      setErro(
        "Não foi possível atualizar o financiamento."
      );

      throw error;
    }
  }

  async function removerFinanciamento(
    financiamentoId
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      await excluirFinanciamentoService(
        usuario.uid,
        financiamentoId
      );

      setFinanciamentos(
        (financiamentosAtuais) =>
          financiamentosAtuais.filter(
            (financiamento) =>
              financiamento.id !==
              financiamentoId
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir financiamento:",
        error
      );

      setErro(
        "Não foi possível excluir o financiamento."
      );

      throw error;
    }
  }

  const valor = {
    financiamentos,
    carregando,
    erro,
    carregarFinanciamentos,
    adicionarFinanciamento,
    editarFinanciamento,
    removerFinanciamento,
  };

  return (
    <FinanciamentosContext.Provider
      value={valor}
    >
      {children}
    </FinanciamentosContext.Provider>
  );
}

export function useFinanciamentos() {
  const contexto = useContext(
    FinanciamentosContext
  );

  if (!contexto) {
    throw new Error(
      "useFinanciamentos deve ser utilizado dentro de um FinanciamentosProvider."
    );
  }

  return contexto;
}