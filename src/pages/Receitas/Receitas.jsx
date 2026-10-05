import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useReceitas } from "../../contexts/ReceitasContext";

import "../../styles/receitas.scss";

function campoNumericoValido(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return true;
  }

  const numero = Number(String(valor).replace(",", "."));

  return Number.isFinite(numero);
}

function campoNumericoMaiorQueZero(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return true;
  }

  const numero = Number(String(valor).replace(",", "."));

  return Number.isFinite(numero) && numero > 0;
}

const schemaReceita = z
  .object({
    tipo: z.enum(["fixa", "variavel"], {
      error: "Selecione o tipo da receita.",
    }),

    categoria: z
      .string()
      .trim()
      .min(1, "Informe a categoria."),

    descricao: z
      .string()
      .trim()
      .min(1, "Informe a descrição."),

    valor: z
      .string()
      .trim()
      .min(1, "Informe o valor.")
      .refine(
        campoNumericoValido,
        "Informe um valor numérico válido."
      )
      .refine(
        campoNumericoMaiorQueZero,
        "Informe um valor maior que zero."
      ),

    data: z
      .string()
      .min(1, "Informe a data."),

    km: z
      .string()
      .optional()
      .refine(
        campoNumericoValido,
        "Informe um KM válido."
      )
      .refine(
        campoNumericoMaiorQueZero,
        "O KM deve ser maior que zero."
      ),

    horas: z
      .string()
      .optional()
      .refine(
        campoNumericoValido,
        "Informe uma quantidade de horas válida."
      )
      .refine(
        campoNumericoMaiorQueZero,
        "As horas devem ser maiores que zero."
      ),
  })
  .superRefine((dados, contexto) => {
    if (dados.tipo === "fixa") {
      return;
    }

    const valor = Number(
      String(dados.valor).replace(",", ".")
    );

    if (!Number.isFinite(valor) || valor <= 0) {
      contexto.addIssue({
        code: "custom",
        path: ["valor"],
        message: "Informe um valor maior que zero.",
      });
    }
  });

function obterDataAtual() {
  return new Date().toISOString().split("T")[0];
}

function valoresIniciais() {
  return {
    tipo: "fixa",
    categoria: "",
    descricao: "",
    valor: "",
    data: obterDataAtual(),
    km: "",
    horas: "",
  };
}

function converterNumero(valor) {
  if (!valor) {
    return 0;
  }

  return Number(
    String(valor)
      .trim()
      .replace(",", ".")
  );
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarData(data) {
  if (!data) {
    return "-";
  }

  const partes = data.split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function Receitas() {
  const {
    receitas,
    carregando,
    erro,
    adicionarReceita,
    editarReceita,
    removerReceita,
  } = useReceitas();

  const [receitaEmEdicao, setReceitaEmEdicao] =
    useState(null);

  const [excluindoId, setExcluindoId] =
    useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(schemaReceita),
    defaultValues: valoresIniciais(),
    mode: "onBlur",
  });

  const tipoReceita = watch("tipo");
  const valorInformado = watch("valor");
  const kmInformado = watch("km");
  const horasInformadas = watch("horas");

  const valorAtual = converterNumero(
    valorInformado
  );

  const kmAtual = converterNumero(kmInformado);

  const horasAtuais = converterNumero(
    horasInformadas
  );

  const valorPorKm =
    tipoReceita === "variavel" &&
    valorAtual > 0 &&
    kmAtual > 0
      ? valorAtual / kmAtual
      : 0;

  const valorPorHora =
    tipoReceita === "variavel" &&
    valorAtual > 0 &&
    horasAtuais > 0
      ? valorAtual / horasAtuais
      : 0;

  async function onSubmit(dados) {
    const receitaFixa = dados.tipo === "fixa";

    const dadosFormatados = {
      tipo: dados.tipo,
      categoria: dados.categoria.trim(),
      descricao: dados.descricao.trim(),
      valor: converterNumero(dados.valor),
      data: dados.data,

      km:
        !receitaFixa && dados.km
          ? converterNumero(dados.km)
          : null,

      horas:
        !receitaFixa && dados.horas
          ? converterNumero(dados.horas)
          : null,
    };

    if (receitaEmEdicao) {
      await editarReceita(
        receitaEmEdicao.id,
        dadosFormatados
      );

      cancelarEdicao();

      return;
    }

    await adicionarReceita(dadosFormatados);

    reset(valoresIniciais());
  }

  function iniciarEdicao(receita) {
    setReceitaEmEdicao(receita);

    reset({
      tipo: receita.tipo || "fixa",
      categoria: receita.categoria || "",
      descricao: receita.descricao || "",
      valor:
        receita.valor !== null &&
        receita.valor !== undefined
          ? String(receita.valor).replace(".", ",")
          : "",
      data:
        receita.data || obterDataAtual(),
      km:
        receita.km !== null &&
        receita.km !== undefined
          ? String(receita.km).replace(".", ",")
          : "",
      horas:
        receita.horas !== null &&
        receita.horas !== undefined
          ? String(receita.horas).replace(".", ",")
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelarEdicao() {
    setReceitaEmEdicao(null);

    reset(valoresIniciais());
  }

  async function handleExcluir(receita) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a receita "${receita.descricao}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setExcluindoId(receita.id);

      await removerReceita(receita.id);

      if (receitaEmEdicao?.id === receita.id) {
        cancelarEdicao();
      }
    } catch (error) {
      console.error(
        "Erro ao excluir receita:",
        error
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function handleLimpar() {
    if (receitaEmEdicao) {
      cancelarEdicao();

      return;
    }

    reset(valoresIniciais());
  }

  return (
    <div className="receitas-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            Gestão financeira
          </span>

          <h1>Receitas</h1>

          <p>
            Cadastre e acompanhe suas receitas financeiras.
          </p>
        </div>
      </div>

      <div className="receitas-grid">
        <section
          className={`receita-form-card ${
            receitaEmEdicao
              ? "receita-form-editando"
              : ""
          }`}
        >
          <div className="receita-card-header">
            <div>
              <span className="receita-card-eyebrow">
                {receitaEmEdicao
                  ? "Editando receita"
                  : "Nova receita"}
              </span>

              <h2>
                {receitaEmEdicao
                  ? "Editar receita"
                  : "Adicionar receita"}
              </h2>
            </div>

            <div className="receita-header-icon">
              <i
                className={
                  receitaEmEdicao
                    ? "bi bi-pencil"
                    : "bi bi-plus-lg"
                }
              ></i>
            </div>
          </div>

          <form
            className="receita-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="receita-form-grid">
              <div className="receita-field">
                <label htmlFor="tipo">
                  Tipo
                </label>

                <select
                  id="tipo"
                  {...register("tipo")}
                  className={
                    errors.tipo
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="fixa">
                    Receita fixa
                  </option>

                  <option value="variavel">
                    Receita variável
                  </option>
                </select>

                {errors.tipo && (
                  <span className="field-error">
                    {errors.tipo.message}
                  </span>
                )}
              </div>

              <div className="receita-field">
                <label htmlFor="categoria">
                  Categoria
                </label>

                <select
                  id="categoria"
                  {...register("categoria")}
                  className={
                    errors.categoria
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Selecione uma categoria
                  </option>

                  <option value="Salário">
                    Salário
                  </option>

                  <option value="Renda extra">
                    Renda extra
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>

                  <option value="Investimentos">
                    Investimentos
                  </option>

                  <option value="Outros">
                    Outros
                  </option>
                </select>

                {errors.categoria && (
                  <span className="field-error">
                    {errors.categoria.message}
                  </span>
                )}
              </div>

              <div className="receita-field receita-field-full">
                <label htmlFor="descricao">
                  Descrição
                </label>

                <input
                  id="descricao"
                  type="text"
                  placeholder="Ex.: Salário mensal"
                  {...register("descricao")}
                  className={
                    errors.descricao
                      ? "input-error"
                      : ""
                  }
                />

                {errors.descricao && (
                  <span className="field-error">
                    {errors.descricao.message}
                  </span>
                )}
              </div>

              <div className="receita-field">
                <label htmlFor="valor">
                  Valor recebido
                </label>

                <div className="input-money">
                  <span>R$</span>

                  <input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    {...register("valor")}
                    className={
                      errors.valor
                        ? "input-error"
                        : ""
                    }
                  />
                </div>

                {errors.valor && (
                  <span className="field-error">
                    {errors.valor.message}
                  </span>
                )}
              </div>

              <div className="receita-field">
                <label htmlFor="data">
                  Data
                </label>

                <input
                  id="data"
                  type="date"
                  {...register("data")}
                  className={
                    errors.data
                      ? "input-error"
                      : ""
                  }
                />

                {errors.data && (
                  <span className="field-error">
                    {errors.data.message}
                  </span>
                )}
              </div>

              {tipoReceita === "variavel" && (
                <>
                  <div className="receita-field">
                    <label htmlFor="km">
                      KM percorridos
                      <small> opcional</small>
                    </label>

                    <input
                      id="km"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex.: 300"
                      {...register("km")}
                      className={
                        errors.km
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.km && (
                      <span className="field-error">
                        {errors.km.message}
                      </span>
                    )}
                  </div>

                  <div className="receita-field">
                    <label htmlFor="horas">
                      Horas trabalhadas
                      <small> opcional</small>
                    </label>

                    <input
                      id="horas"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ex.: 8"
                      {...register("horas")}
                      className={
                        errors.horas
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.horas && (
                      <span className="field-error">
                        {errors.horas.message}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {tipoReceita === "variavel" && (
              <div className="receita-metricas">
                <div className="receita-metrica">
                  <div className="receita-metrica-icon">
                    <i className="bi bi-signpost-2"></i>
                  </div>

                  <div>
                    <span>Valor por KM</span>

                    <strong>
                      {valorPorKm > 0
                        ? `R$ ${formatarMoeda(
                            valorPorKm
                          )}`
                        : "—"}
                    </strong>
                  </div>
                </div>

                <div className="receita-metrica">
                  <div className="receita-metrica-icon">
                    <i className="bi bi-clock"></i>
                  </div>

                  <div>
                    <span>Valor por hora</span>

                    <strong>
                      {valorPorHora > 0
                        ? `R$ ${formatarMoeda(
                            valorPorHora
                          )}`
                        : "—"}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {tipoReceita === "fixa" && (
              <div className="receita-info">
                <i className="bi bi-info-circle"></i>

                <span>
                  Receitas fixas não utilizam KM ou horas
                  trabalhadas.
                </span>
              </div>
            )}

            {tipoReceita === "variavel" && (
              <div className="receita-info">
                <i className="bi bi-info-circle"></i>

                <span>
                  Informe KM e/ou horas para calcular
                  automaticamente seus indicadores.
                </span>
              </div>
            )}

            {erro && (
              <div className="receita-alert receita-alert-error">
                <i className="bi bi-exclamation-circle"></i>

                <span>{erro}</span>
              </div>
            )}

            <div className="receita-form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleLimpar}
                disabled={isSubmitting}
              >
                {receitaEmEdicao
                  ? "Cancelar"
                  : "Limpar"}
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>

                    {receitaEmEdicao
                      ? "Atualizando..."
                      : "Salvando..."}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>

                    {receitaEmEdicao
                      ? "Atualizar receita"
                      : "Salvar receita"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="receitas-list-card">
          <div className="receita-card-header">
            <div>
              <span className="receita-card-eyebrow">
                Histórico
              </span>

              <h2>Receitas cadastradas</h2>
            </div>

            <div className="receita-count">
              {receitas.length}
            </div>
          </div>

          {carregando ? (
            <div className="receita-empty">
              <span
                className="spinner-border"
                role="status"
              ></span>

              <p>Carregando receitas...</p>
            </div>
          ) : receitas.length === 0 ? (
            <div className="receita-empty">
              <div className="receita-empty-icon">
                <i className="bi bi-wallet2"></i>
              </div>

              <h3>
                Nenhuma receita cadastrada
              </h3>

              <p>
                Cadastre sua primeira receita usando o
                formulário ao lado.
              </p>
            </div>
          ) : (
            <div className="receitas-list">
              {receitas.map((receita) => {
                const receitaVariavel =
                  receita.tipo === "variavel";

                const receitaValor = Number(
                  receita.valor || 0
                );

                const receitaKm = Number(
                  receita.km || 0
                );

                const receitaHoras = Number(
                  receita.horas || 0
                );

                const receitaPorKm =
                  receitaVariavel &&
                  receitaValor > 0 &&
                  receitaKm > 0
                    ? receitaValor / receitaKm
                    : 0;

                const receitaPorHora =
                  receitaVariavel &&
                  receitaValor > 0 &&
                  receitaHoras > 0
                    ? receitaValor / receitaHoras
                    : 0;

                const estaExcluindo =
                  excluindoId === receita.id;

                const estaEditando =
                  receitaEmEdicao?.id === receita.id;

                return (
                  <div
                    className={`receita-list-item receita-list-item-expanded ${
                      estaEditando
                        ? "receita-list-item-editando"
                        : ""
                    }`}
                    key={receita.id}
                  >
                    <div
                      className={`receita-list-icon ${
                        receitaVariavel
                          ? "receita-icon-variavel"
                          : ""
                      }`}
                    >
                      <i
                        className={
                          receitaVariavel
                            ? "bi bi-car-front"
                            : "bi bi-arrow-up"
                        }
                      ></i>
                    </div>

                    <div className="receita-list-content">
                      <div className="receita-list-title">
                        <strong>
                          {receita.descricao}
                        </strong>

                        <span
                          className={`receita-tipo-badge ${
                            receitaVariavel
                              ? "badge-variavel"
                              : "badge-fixa"
                          }`}
                        >
                          {receitaVariavel
                            ? "Variável"
                            : "Fixa"}
                        </span>
                      </div>

                      <span>
                        {receita.categoria}
                      </span>

                      <small>
                        {formatarData(receita.data)}
                      </small>

                      {receitaVariavel && (
                        <div className="receita-indicadores-lista">
                          {receitaKm > 0 && (
                            <span>
                              <i className="bi bi-signpost-2"></i>
                              {receitaKm} km
                            </span>
                          )}

                          {receitaHoras > 0 && (
                            <span>
                              <i className="bi bi-clock"></i>
                              {receitaHoras} h
                            </span>
                          )}

                          {receitaPorKm > 0 && (
                            <span>
                              <i className="bi bi-cash"></i>
                              R${" "}
                              {formatarMoeda(
                                receitaPorKm
                              )}
                              /km
                            </span>
                          )}

                          {receitaPorHora > 0 && (
                            <span>
                              <i className="bi bi-cash-stack"></i>
                              R${" "}
                              {formatarMoeda(
                                receitaPorHora
                              )}
                              /h
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="receita-list-value">
                      R${" "}
                      {formatarMoeda(
                        receita.valor
                      )}
                    </div>

                    <div className="receita-list-actions">
                      <button
                        type="button"
                        className="receita-action-edit"
                        onClick={() =>
                          iniciarEdicao(receita)
                        }
                        disabled={
                          estaExcluindo ||
                          isSubmitting
                        }
                        title="Editar receita"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        type="button"
                        className="receita-action-delete"
                        onClick={() =>
                          handleExcluir(receita)
                        }
                        disabled={
                          estaExcluindo ||
                          isSubmitting
                        }
                        title="Excluir receita"
                      >
                        {estaExcluindo ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Receitas;