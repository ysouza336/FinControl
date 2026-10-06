import { useState } from "react";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import {
  useFinanciamentos,
} from "../../contexts/FinanciamentosContext";

import "../../styles/financiamento.scss"

const financiamentoSchema =
  z.object({
    veiculo: z
      .string()
      .trim()
      .min(
        2,
        "Informe o veículo."
      )
      .max(
        100,
        "O nome do veículo deve ter no máximo 100 caracteres."
      ),

    banco: z
      .string()
      .trim()
      .min(
        2,
        "Informe o banco ou financeira."
      )
      .max(
        100,
        "O nome deve ter no máximo 100 caracteres."
      ),

    valorFinanciado: z
      .string()
      .min(
        1,
        "Informe o valor financiado."
      )
      .refine(
        (valor) => {
          const numero =
            Number(
              valor.replace(",", ".")
            );

          return (
            Number.isFinite(numero) &&
            numero > 0
          );
        },
        {
          message:
            "Informe um valor maior que zero.",
        }
      ),

    entrada: z
      .string()
      .min(
        1,
        "Informe o valor da entrada."
      )
      .refine(
        (valor) => {
          const numero =
            Number(
              valor.replace(",", ".")
            );

          return (
            Number.isFinite(numero) &&
            numero >= 0
          );
        },
        {
          message:
            "Informe uma entrada válida.",
        }
      ),

    quantidadeParcelas: z
      .string()
      .min(
        1,
        "Informe a quantidade de parcelas."
      )
      .refine(
        (valor) => {
          const numero =
            Number(valor);

          return (
            Number.isInteger(numero) &&
            numero > 0
          );
        },
        {
          message:
            "Informe uma quantidade inteira maior que zero.",
        }
      ),

    valorParcela: z
      .string()
      .min(
        1,
        "Informe o valor da parcela."
      )
      .refine(
        (valor) => {
          const numero =
            Number(
              valor.replace(",", ".")
            );

          return (
            Number.isFinite(numero) &&
            numero > 0
          );
        },
        {
          message:
            "Informe um valor maior que zero.",
        }
      ),

    primeiraParcela: z
      .string()
      .min(
        1,
        "Informe a data da primeira parcela."
      ),
  });

function converterNumero(valor) {
  return Number(
    String(valor).replace(",", ".")
  );
}

function formatarMoeda(valor) {
  return Number(
    valor || 0
  ).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  const partes =
    String(data).split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function Financiamento() {
  const {
    financiamentos,
    carregando,
    erro,
    adicionarFinanciamento,
    editarFinanciamento,
    removerFinanciamento,
  } = useFinanciamentos();

  const [
    financiamentoEditandoId,
    setFinanciamentoEditandoId,
  ] = useState(null);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    excluindoId,
    setExcluindoId,
  ] = useState(null);

  const [
    mensagemSucesso,
    setMensagemSucesso,
  ] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        financiamentoSchema
      ),
    mode: "onBlur",
    defaultValues: {
      veiculo: "",
      banco: "",
      valorFinanciado: "",
      entrada: "",
      quantidadeParcelas: "",
      valorParcela: "",
      primeiraParcela: "",
    },
  });

  async function onSubmit(dados) {
    try {
      setSalvando(true);
      setMensagemSucesso("");

      const dadosConvertidos = {
        ...dados,
        valorFinanciado:
          converterNumero(
            dados.valorFinanciado
          ),
        entrada:
          converterNumero(
            dados.entrada
          ),
        quantidadeParcelas:
          Number(
            dados.quantidadeParcelas
          ),
        valorParcela:
          converterNumero(
            dados.valorParcela
          ),
        status: "ativo",
      };

      if (
        financiamentoEditandoId
      ) {
        await editarFinanciamento(
          financiamentoEditandoId,
          dadosConvertidos
        );

        setMensagemSucesso(
          "Financiamento atualizado com sucesso."
        );
      } else {
        await adicionarFinanciamento(
          dadosConvertidos
        );

        setMensagemSucesso(
          "Financiamento cadastrado e parcelas geradas com sucesso."
        );
      }

      reset();

      setFinanciamentoEditandoId(
        null
      );
    } catch (error) {
      console.error(
        "Erro ao salvar financiamento:",
        error
      );
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(
    financiamento
  ) {
    setMensagemSucesso("");

    setFinanciamentoEditandoId(
      financiamento.id
    );

    setValue(
      "veiculo",
      financiamento.veiculo || ""
    );

    setValue(
      "banco",
      financiamento.banco || ""
    );

    setValue(
      "valorFinanciado",
      financiamento.valorFinanciado ??
        ""
    );

    setValue(
      "entrada",
      financiamento.entrada ?? ""
    );

    setValue(
      "quantidadeParcelas",
      financiamento.quantidadeParcelas ??
        ""
    );

    setValue(
      "valorParcela",
      financiamento.valorParcela ??
        ""
    );

    setValue(
      "primeiraParcela",
      financiamento.primeiraParcela ||
        ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    setFinanciamentoEditandoId(
      null
    );

    setMensagemSucesso("");

    reset();
  }

  async function excluir(
    financiamento
  ) {
    const confirmar =
      window.confirm(
        `Deseja realmente excluir o financiamento do veículo "${financiamento.veiculo}"?`
      );

    if (!confirmar) {
      return;
    }

    try {
      setExcluindoId(
        financiamento.id
      );

      setMensagemSucesso("");

      await removerFinanciamento(
        financiamento.id
      );

      if (
        financiamentoEditandoId ===
        financiamento.id
      ) {
        cancelarEdicao();
      }

      setMensagemSucesso(
        "Financiamento excluído com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao excluir financiamento:",
        error
      );
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <main className="pagina-financiamento">
      <section className="pagina-financiamento__cabecalho">
        <div>
          <span className="pagina-financiamento__eyebrow">
            Controle veicular
          </span>

          <h1>
            Financiamento
          </h1>

          <p>
            Controle seus financiamentos,
            parcelas e evolução dos pagamentos.
          </p>
        </div>
      </section>

      <section className="financiamento-card">
        <div className="financiamento-card__cabecalho">
          <div>
            <span className="financiamento-card__eyebrow">
              {financiamentoEditandoId
                ? "Editar financiamento"
                : "Novo financiamento"}
            </span>

            <h2>
              {financiamentoEditandoId
                ? "Atualizar financiamento"
                : "Cadastrar financiamento veicular"}
            </h2>
          </div>
        </div>

        {mensagemSucesso && (
          <div className="financiamento-alerta financiamento-alerta--sucesso">
            {mensagemSucesso}
          </div>
        )}

        {erro && (
          <div className="financiamento-alerta financiamento-alerta--erro">
            {erro}
          </div>
        )}

        <form
          className="financiamento-formulario"
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <div className="financiamento-formulario__grupo">
            <label htmlFor="veiculo">
              Veículo
            </label>

            <input
              id="veiculo"
              type="text"
              placeholder="Ex.: Volkswagen Virtus"
              {...register("veiculo")}
            />

            {errors.veiculo && (
              <span className="financiamento-formulario__erro">
                {errors.veiculo.message}
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="banco">
              Banco / Financeira
            </label>

            <input
              id="banco"
              type="text"
              placeholder="Ex.: Santander"
              {...register("banco")}
            />

            {errors.banco && (
              <span className="financiamento-formulario__erro">
                {errors.banco.message}
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="valorFinanciado">
              Valor financiado
            </label>

            <input
              id="valorFinanciado"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register(
                "valorFinanciado"
              )}
            />

            {errors.valorFinanciado && (
              <span className="financiamento-formulario__erro">
                {
                  errors
                    .valorFinanciado
                    .message
                }
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="entrada">
              Entrada
            </label>

            <input
              id="entrada"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("entrada")}
            />

            {errors.entrada && (
              <span className="financiamento-formulario__erro">
                {errors.entrada.message}
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="quantidadeParcelas">
              Quantidade de parcelas
            </label>

            <input
              id="quantidadeParcelas"
              type="number"
              min="1"
              step="1"
              placeholder="Ex.: 60"
              {...register(
                "quantidadeParcelas"
              )}
            />

            {errors.quantidadeParcelas && (
              <span className="financiamento-formulario__erro">
                {
                  errors
                    .quantidadeParcelas
                    .message
                }
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="valorParcela">
              Valor da parcela
            </label>

            <input
              id="valorParcela"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register(
                "valorParcela"
              )}
            />

            {errors.valorParcela && (
              <span className="financiamento-formulario__erro">
                {
                  errors
                    .valorParcela
                    .message
                }
              </span>
            )}
          </div>

          <div className="financiamento-formulario__grupo">
            <label htmlFor="primeiraParcela">
              Primeira parcela
            </label>

            <input
              id="primeiraParcela"
              type="date"
              {...register(
                "primeiraParcela"
              )}
            />

            {errors.primeiraParcela && (
              <span className="financiamento-formulario__erro">
                {
                  errors
                    .primeiraParcela
                    .message
                }
              </span>
            )}
          </div>

          <div className="financiamento-formulario__acoes">
            <button
              type="submit"
              className="financiamento-botao financiamento-botao--primario"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : financiamentoEditandoId
                ? "Salvar alterações"
                : "Cadastrar financiamento"}
            </button>

            {financiamentoEditandoId && (
              <button
                type="button"
                className="financiamento-botao financiamento-botao--secundario"
                onClick={
                  cancelarEdicao
                }
                disabled={salvando}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="financiamento-card">
        <div className="financiamento-card__cabecalho">
          <div>
            <span className="financiamento-card__eyebrow">
              Seus financiamentos
            </span>

            <h2>
              Financiamentos cadastrados
            </h2>
          </div>

          <span className="financiamento-card__contador">
            {financiamentos.length}
          </span>
        </div>

        {carregando ? (
          <div className="financiamento-estado">
            Carregando financiamentos...
          </div>
        ) : financiamentos.length ===
          0 ? (
          <div className="financiamento-estado">
            Nenhum financiamento cadastrado.
          </div>
        ) : (
          <div className="financiamento-lista">
            {financiamentos.map(
              (financiamento) => (
                <article
                  key={
                    financiamento.id
                  }
                  className="financiamento-item"
                >
                  <div className="financiamento-item__principal">
                    <div>
                      <span className="financiamento-item__eyebrow">
                        Veículo
                      </span>

                      <h3>
                        {
                          financiamento.veiculo
                        }
                      </h3>

                      <p>
                        {
                          financiamento.banco
                        }
                      </p>
                    </div>

                    <span className="financiamento-item__status">
                      {financiamento.status ===
                      "ativo"
                        ? "Ativo"
                        : financiamento.status}
                    </span>
                  </div>

                  <div className="financiamento-item__detalhes">
                    <div>
                      <span>
                        Financiado
                      </span>

                      <strong>
                        {formatarMoeda(
                          financiamento.valorFinanciado
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Entrada
                      </span>

                      <strong>
                        {formatarMoeda(
                          financiamento.entrada
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Parcelas
                      </span>

                      <strong>
                        {
                          financiamento.quantidadeParcelas
                        }{" "}
                        x{" "}
                        {formatarMoeda(
                          financiamento.valorParcela
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Primeira parcela
                      </span>

                      <strong>
                        {formatarData(
                          financiamento.primeiraParcela
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="financiamento-item__acoes">
                    <button
                      type="button"
                      className="financiamento-botao financiamento-botao--editar"
                      onClick={() =>
                        iniciarEdicao(
                          financiamento
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="financiamento-botao financiamento-botao--excluir"
                      onClick={() =>
                        excluir(
                          financiamento
                        )
                      }
                      disabled={
                        excluindoId ===
                        financiamento.id
                      }
                    >
                      {excluindoId ===
                      financiamento.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}