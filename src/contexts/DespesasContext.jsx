import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  atualizarDespesa as atualizarDespesaService,
  buscarDespesas,
  excluirDespesa as excluirDespesaService,
  salvarDespesa as salvarDespesaService,
} from "../services/despesas";

const DespesasContext = createContext(null);

export function DespesasProvider({ children }) {
  const {
    usuario,
    carregando: carregandoAuth,
  } = useAuth();

  const [despesas, setDespesas] = useState([]);
  const [carregando, setCarregando] =
    useState(true);
  const [erro, setErro] = useState("");

  const carregarDespesas = useCallback(
    async () => {
      if (!usuario?.uid) {
        setDespesas([]);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const dados = await buscarDespesas(
          usuario.uid
        );

        setDespesas(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar despesas:",
          error
        );

        setErro(
          "Não foi possível carregar as despesas."
        );
      } finally {
        setCarregando(false);
      }
    },
    [usuario?.uid]
  );

  useEffect(() => {
    if (carregandoAuth) {
      return;
    }

    carregarDespesas();
  }, [
    carregandoAuth,
    carregarDespesas,
  ]);

  async function adicionarDespesa(
    dadosDespesa
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      const novaDespesa =
        await salvarDespesaService(
          usuario.uid,
          dadosDespesa
        );

      setDespesas(
        (despesasAtuais) => [
          novaDespesa,
          ...despesasAtuais,
        ]
      );

      return novaDespesa;
    } catch (error) {
      console.error(
        "Erro ao adicionar despesa:",
        error
      );

      setErro(
        "Não foi possível adicionar a despesa."
      );

      throw error;
    }
  }

  async function editarDespesa(
    despesaId,
    dadosDespesa
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      const despesaAtualizada =
        await atualizarDespesaService(
          usuario.uid,
          despesaId,
          dadosDespesa
        );

      setDespesas(
        (despesasAtuais) =>
          despesasAtuais.map(
            (despesa) =>
              despesa.id === despesaId
                ? {
                    ...despesa,
                    ...despesaAtualizada,
                  }
                : despesa
          )
      );

      return despesaAtualizada;
    } catch (error) {
      console.error(
        "Erro ao editar despesa:",
        error
      );

      setErro(
        "Não foi possível atualizar a despesa."
      );

      throw error;
    }
  }

  async function removerDespesa(
    despesaId
  ) {
    if (!usuario?.uid) {
      throw new Error(
        "Usuário não autenticado."
      );
    }

    try {
      setErro("");

      await excluirDespesaService(
        usuario.uid,
        despesaId
      );

      setDespesas(
        (despesasAtuais) =>
          despesasAtuais.filter(
            (despesa) =>
              despesa.id !== despesaId
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir despesa:",
        error
      );

      setErro(
        "Não foi possível excluir a despesa."
      );

      throw error;
    }
  }

  const valor = {
    despesas,
    carregando,
    erro,
    carregarDespesas,
    adicionarDespesa,
    editarDespesa,
    removerDespesa,
  };

  return (
    <DespesasContext.Provider value={valor}>
      {children}
    </DespesasContext.Provider>
  );
}

export function useDespesas() {
  const contexto =
    useContext(DespesasContext);

  if (!contexto) {
    throw new Error(
      "useDespesas deve ser utilizado dentro de um DespesasProvider."
    );
  }

  return contexto;
}