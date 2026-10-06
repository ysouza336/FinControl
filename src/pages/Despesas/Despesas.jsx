import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDespesas } from "../../contexts/DespesasContext";
import { categoriasDespesas } from "../../constants/categoriasDespesas";
import "../../styles/despesas.scss"

const despesasSchema = z.object({
  tipo: z
    .string()
    .min(1, "Selecione o tipo da despesa."),

  categoria: z
    .string()
    .min(1, "Selecione uma categoria."),

  descricao: z
    .string()
    .trim()
    .min(
      3,
      "A descrição deve possuir pelo menos 3 caracteres."
    )
    .max(
      100,
      "A descrição deve possuir no máximo 100 caracteres."
    ),

  valor: z
    .string()
    .trim()
    .min(1, "Informe o valor da despesa.")
    .refine(
      (valor) => {
        const numero = Number(
          String(valor).replace(",", ".")
        );

        return Number.isFinite(numero);
      },
      {
        message: "Informe um valor numérico válido.",
      }
    )
    .refine(
      (valor) => {
        const numero = Number(
          String(valor).replace(",", ".")
        );

        return numero > 0;
      },
      {
        message: "O valor deve ser maior que zero.",
      }
    ),

  data: z
    .string()
    .min(1, "Informe a data da despesa."),

  formaPagamento: z
    .string()
    .min(
      1,
      "Selecione uma forma de pagamento."
    ),
});

function obterDataAtual() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(
    hoje.getMonth() + 1
  ).padStart(2, "0");
  const dia = String(
    hoje.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function converterValorNumerico(valor) {
  const valorNormalizado = String(valor)
    .replace(",", ".")
    .trim();

  return Number(valorNormalizado);
}

function formatarMoeda(valor) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return "R$ 0,00";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  const partes = String(data).split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterNomeCategoria(valor) {
  const categoria = categoriasDespesas.find(
    (item) => item.valor === valor
  );

  return categoria?.label || "Outros";
}

function obterNomeFormaPagamento(valor) {
  const formasPagamento = {
    pix: "Pix",
    debito: "Cartão de débito",
    credito: "Cartão de crédito",
    dinheiro: "Dinheiro",
    boleto: "Boleto",
    transferencia: "Transferência",
  };

  return formasPagamento[valor] || "Não informado";
}

function obterNomeTipo(tipo) {
  return tipo === "variavel"
    ? "Variável"
    : "Fixa";
}

export default function Despesas() {
  const {
    despesas,
    carregando,
    erro,
    adicionarDespesa,
    editarDespesa,
    removerDespesa,
  } = useDespesas();

  const [despesaEditandoId, setDespesaEditandoId] =
    useState(null);

  const [salvando, setSalvando] =
    useState(false);

  const [excluindoId, setExcluindoId] =
    useState(null);

  const [mensagemSucesso, setMensagemSucesso] =
    useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(despesasSchema),
    mode: "onBlur",
    defaultValues: {
      tipo: "fixa",
      categoria: "",
      descricao: "",
      valor: "",
      data: obterDataAtual(),
      formaPagamento: "",
    },
  });

  function limparFormulario() {
    reset({
      tipo: "fixa",
      categoria: "",
      descricao: "",
      valor: "",
      data: obterDataAtual(),
      formaPagamento: "",
    });

    setDespesaEditandoId(null);
    setMensagemSucesso("");
  }

  function iniciarEdicao(despesa) {
    setDespesaEditandoId(despesa.id);

    setValue(
      "tipo",
      despesa.tipo || "fixa"
    );

    setValue(
      "categoria",
      despesa.categoria || ""
    );

    setValue(
      "descricao",
      despesa.descricao || ""
    );

    setValue(
      "valor",
      despesa.valor !== undefined &&
        despesa.valor !== null
        ? String(despesa.valor).replace(
            ".",
            ","
          )
        : ""
    );

    setValue(
      "data",
      despesa.data || obterDataAtual()
    );

    setValue(
      "formaPagamento",
      despesa.formaPagamento || ""
    );

    setMensagemSucesso("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function onSubmit(dados) {
    try {
      setSalvando(true);
      setMensagemSucesso("");

      const dadosDespesa = {
        tipo: dados.tipo,
        categoria: dados.categoria,
        descricao: dados.descricao.trim(),
        valor: converterValorNumerico(
          dados.valor
        ),
        data: dados.data,
        formaPagamento:
          dados.formaPagamento,
      };

      if (despesaEditandoId) {
        await editarDespesa(
          despesaEditandoId,
          dadosDespesa
        );

        setMensagemSucesso(
          "Despesa atualizada com sucesso!"
        );
      } else {
        await adicionarDespesa(
          dadosDespesa
        );

        setMensagemSucesso(
          "Despesa cadastrada com sucesso!"
        );
      }

      limparFormulario();
    } catch (error) {
      console.error(
        "Erro ao salvar despesa:",
        error
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(despesa) {
    const confirmou = window.confirm(
      `Deseja realmente excluir a despesa "${despesa.descricao}"?`
    );

    if (!confirmou) {
      return;
    }

    try {
      setExcluindoId(despesa.id);
      setMensagemSucesso("");

      await removerDespesa(despesa.id);

      if (despesaEditandoId === despesa.id) {
        limparFormulario();
      }

      setMensagemSucesso(
        "Despesa excluída com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao excluir despesa:",
        error
      );
    } finally {
      setExcluindoId(null);
    }
  }

  const totalDespesas = despesas.reduce(
    (total, despesa) =>
      total + Number(despesa.valor || 0),
    0
  );

  return (
    <main className="pagina-despesas">
      <div className="pagina-despesas__cabecalho">
        <div>
          <span className="pagina-despesas__eyebrow">
            Controle financeiro
          </span>

          <h1>Despesas</h1>

          <p>
            Registre e acompanhe suas despesas
            financeiras.
          </p>
        </div>
      </div>

      <section className="despesas-card">
        <div className="despesas-card__cabecalho">
          <div>
            <h2>
              {despesaEditandoId
                ? "Editar despesa"
                : "Nova despesa"}
            </h2>

            <p>
              {despesaEditandoId
                ? "Atualize os dados da despesa selecionada."
                : "Informe os dados da despesa para realizar o cadastro."}
            </p>
          </div>
        </div>

        {mensagemSucesso && (
          <div className="despesas-alerta despesas-alerta--sucesso">
            {mensagemSucesso}
          </div>
        )}

        {erro && (
          <div className="despesas-alerta despesas-alerta--erro">
            {erro}
          </div>
        )}

        <form
          className="despesas-formulario"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="despesas-formulario__grupo">
            <label htmlFor="tipo">
              Tipo de despesa
            </label>

            <select
              id="tipo"
              {...register("tipo")}
            >
              <option value="fixa">
                Fixa
              </option>

              <option value="variavel">
                Variável
              </option>
            </select>

            {errors.tipo && (
              <span className="despesas-formulario__erro">
                {errors.tipo.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__grupo">
            <label htmlFor="categoria">
              Categoria
            </label>

            <select
              id="categoria"
              {...register("categoria")}
            >
              <option value="">
                Selecione uma categoria
              </option>

              {categoriasDespesas.map(
                (categoria) => (
                  <option
                    key={categoria.valor}
                    value={categoria.valor}
                  >
                    {categoria.label}
                  </option>
                )
              )}
            </select>

            {errors.categoria && (
              <span className="despesas-formulario__erro">
                {errors.categoria.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__grupo despesas-formulario__grupo--largura-total">
            <label htmlFor="descricao">
              Descrição
            </label>

            <input
              id="descricao"
              type="text"
              placeholder="Ex.: Supermercado"
              {...register("descricao")}
            />

            {errors.descricao && (
              <span className="despesas-formulario__erro">
                {errors.descricao.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__grupo">
            <label htmlFor="valor">
              Valor
            </label>

            <input
              id="valor"
              type="text"
              inputMode="decimal"
              placeholder="Ex.: 350,00"
              {...register("valor")}
            />

            {errors.valor && (
              <span className="despesas-formulario__erro">
                {errors.valor.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__grupo">
            <label htmlFor="data">
              Data
            </label>

            <input
              id="data"
              type="date"
              {...register("data")}
            />

            {errors.data && (
              <span className="despesas-formulario__erro">
                {errors.data.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__grupo">
            <label htmlFor="formaPagamento">
              Forma de pagamento
            </label>

            <select
              id="formaPagamento"
              {...register(
                "formaPagamento"
              )}
            >
              <option value="">
                Selecione
              </option>

              <option value="pix">
                Pix
              </option>

              <option value="debito">
                Cartão de débito
              </option>

              <option value="credito">
                Cartão de crédito
              </option>

              <option value="dinheiro">
                Dinheiro
              </option>

              <option value="boleto">
                Boleto
              </option>

              <option value="transferencia">
                Transferência
              </option>
            </select>

            {errors.formaPagamento && (
              <span className="despesas-formulario__erro">
                {errors.formaPagamento.message}
              </span>
            )}
          </div>

          <div className="despesas-formulario__acoes">
            {despesaEditandoId && (
              <button
                type="button"
                className="despesas-botao despesas-botao--secundario"
                onClick={limparFormulario}
                disabled={salvando}
              >
                Cancelar edição
              </button>
            )}

            {!despesaEditandoId && (
              <button
                type="button"
                className="despesas-botao despesas-botao--secundario"
                onClick={limparFormulario}
                disabled={salvando}
              >
                Limpar
              </button>
            )}

            <button
              type="submit"
              className="despesas-botao despesas-botao--primario"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : despesaEditandoId
                  ? "Salvar alterações"
                  : "Adicionar despesa"}
            </button>
          </div>
        </form>
      </section>

      <section className="despesas-resumo">
        <div className="despesas-resumo__card">
          <span>
            Despesas cadastradas
          </span>

          <strong>
            {despesas.length}
          </strong>
        </div>

        <div className="despesas-resumo__card">
          <span>
            Total das despesas
          </span>

          <strong>
            {formatarMoeda(
              totalDespesas
            )}
          </strong>
        </div>
      </section>

      <section className="despesas-card">
        <div className="despesas-card__cabecalho">
          <div>
            <h2>
              Despesas cadastradas
            </h2>

            <p>
              Registros salvos na sua conta.
            </p>
          </div>
        </div>

        {carregando ? (
          <div className="despesas-estado">
            Carregando despesas...
          </div>
        ) : despesas.length === 0 ? (
          <div className="despesas-estado">
            Nenhuma despesa cadastrada.
          </div>
        ) : (
          <div className="despesas-lista">
            {despesas.map((despesa) => (
              <article
                className="despesa-item"
                key={despesa.id}
              >
                <div className="despesa-item__principal">
                  <div>
                    <span className="despesa-item__categoria">
                      {obterNomeCategoria(
                        despesa.categoria
                      )}
                    </span>

                    <h3>
                      {despesa.descricao}
                    </h3>

                    <p>
                      {formatarData(
                        despesa.data
                      )}
                    </p>
                  </div>

                  <strong>
                    {formatarMoeda(
                      despesa.valor
                    )}
                  </strong>
                </div>

                <div className="despesa-item__detalhes">
                  <span>
                    Tipo:{" "}
                    {obterNomeTipo(
                      despesa.tipo
                    )}
                  </span>

                  <span>
                    Pagamento:{" "}
                    {obterNomeFormaPagamento(
                      despesa.formaPagamento
                    )}
                  </span>
                </div>

                <div className="despesa-item__acoes">
                  <button
                    type="button"
                    className="despesas-botao despesas-botao--editar"
                    onClick={() =>
                      iniciarEdicao(
                        despesa
                      )
                    }
                    disabled={
                      salvando ||
                      excluindoId !== null
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="despesas-botao despesas-botao--excluir"
                    onClick={() =>
                      handleExcluir(
                        despesa
                      )
                    }
                    disabled={
                      salvando ||
                      excluindoId !== null
                    }
                  >
                    {excluindoId ===
                    despesa.id
                      ? "Excluindo..."
                      : "Excluir"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}