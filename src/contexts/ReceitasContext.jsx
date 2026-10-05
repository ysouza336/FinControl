import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  atualizarReceita as atualizarReceitaService,
  buscarReceitas,
  excluirReceita as excluirReceitaService,
  salvarReceita as salvarReceitaService,
} from "../services/receitas";

const ReceitasContext = createContext(null);

export function ReceitasProvider({ children }) {
  const { usuario, carregando: carregandoAuth } = useAuth();

  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarReceitas = useCallback(async () => {
    if (!usuario?.uid) {
      setReceitas([]);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarReceitas(usuario.uid);

      setReceitas(dados);
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);

      setErro("Não foi possível carregar as receitas.");
    } finally {
      setCarregando(false);
    }
  }, [usuario?.uid]);

  useEffect(() => {
    if (carregandoAuth) {
      return;
    }

    carregarReceitas();
  }, [carregandoAuth, carregarReceitas]);

  async function adicionarReceita(dadosReceita) {
    if (!usuario?.uid) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      setErro("");

      const novaReceita = await salvarReceitaService(
        usuario.uid,
        dadosReceita
      );

      setReceitas((receitasAtuais) => [
        novaReceita,
        ...receitasAtuais,
      ]);

      return novaReceita;
    } catch (error) {
      console.error("Erro ao adicionar receita:", error);

      setErro("Não foi possível adicionar a receita.");

      throw error;
    }
  }

  async function editarReceita(receitaId, dadosReceita) {
    if (!usuario?.uid) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      setErro("");

      const receitaAtualizada = await atualizarReceitaService(
        usuario.uid,
        receitaId,
        dadosReceita
      );

      setReceitas((receitasAtuais) =>
        receitasAtuais.map((receita) =>
          receita.id === receitaId
            ? {
                ...receita,
                ...receitaAtualizada,
              }
            : receita
        )
      );

      return receitaAtualizada;
    } catch (error) {
      console.error("Erro ao editar receita:", error);

      setErro("Não foi possível atualizar a receita.");

      throw error;
    }
  }

  async function removerReceita(receitaId) {
    if (!usuario?.uid) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      setErro("");

      await excluirReceitaService(
        usuario.uid,
        receitaId
      );

      setReceitas((receitasAtuais) =>
        receitasAtuais.filter(
          (receita) => receita.id !== receitaId
        )
      );
    } catch (error) {
      console.error("Erro ao excluir receita:", error);

      setErro("Não foi possível excluir a receita.");

      throw error;
    }
  }

  const valor = {
    receitas,
    carregando,
    erro,
    carregarReceitas,
    adicionarReceita,
    editarReceita,
    removerReceita,
  };

  return (
    <ReceitasContext.Provider value={valor}>
      {children}
    </ReceitasContext.Provider>
  );
}

export function useReceitas() {
  const contexto = useContext(ReceitasContext);

  if (!contexto) {
    throw new Error(
      "useReceitas deve ser utilizado dentro de um ReceitasProvider."
    );
  }

  return contexto;
}