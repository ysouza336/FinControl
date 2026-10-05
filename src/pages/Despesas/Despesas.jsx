import { useState } from "react";

import { useDespesas } from "../../contexts/DespesasContext";

import { categoriasDespesas } from "../../constants/categoriasDespesas";

import "../../styles/despesas.scss";

const formasPagamento = [
  "Pix",
  "Cartão de crédito",
  "Cartão de débito",
  "Dinheiro",
  "Boleto",
  "Transferência",
  "Outro",
];

function Despesas() {
  const {
    despesas,
    carregando,
    erro,
  } = useDespesas();

  const [formulario, setFormulario] =
    useState({
      tipo: "variavel",
      categoria: "",
      descricao: "",
      valor: "",
      data: "",
      formaPagamento: "",
    });

  function atualizarCampo(
    campo,
    valor
  ) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log(
      "Dados da despesa:",
      formulario
    );
  }

  function limparFormulario() {
    setFormulario({
      tipo: "variavel",
      categoria: "",
      descricao: "",
      valor: "",
      data: "",
      formaPagamento: "",
    });
  }

  return (
    <div className="despesas-page">
      <div className="page-header">
        <div>
          <h1>Despesas</h1>

          <p>
            Cadastre e acompanhe suas despesas.
          </p>
        </div>
      </div>

      <div className="despesas-grid">
        <section className="despesa-form-card">
          <div className="section-header">
            <div>
              <h2>Nova despesa</h2>

              <p>
                Informe os dados da despesa.
              </p>
            </div>
          </div>

          {erro && (
            <div className="despesa-alert despesa-alert-error">
              {erro}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="despesa-form"
          >
            <div className="form-group">
              <label htmlFor="tipo">
                Tipo
              </label>

              <select
                id="tipo"
                value={formulario.tipo}
                onChange={(event) =>
                  atualizarCampo(
                    "tipo",
                    event.target.value
                  )
                }
              >
                <option value="fixa">
                  Fixa
                </option>

                <option value="variavel">
                  Variável
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoria">
                Categoria
              </label>

              <select
                id="categoria"
                value={formulario.categoria}
                onChange={(event) =>
                  atualizarCampo(
                    "categoria",
                    event.target.value
                  )
                }
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
            </div>

            <div className="form-group">
              <label htmlFor="descricao">
                Descrição
              </label>

              <input
                id="descricao"
                type="text"
                placeholder="Ex.: Mercado"
                value={formulario.descricao}
                onChange={(event) =>
                  atualizarCampo(
                    "descricao",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="valor">
                  Valor
                </label>

                <div className="money-input">
                  <span>R$</span>

                  <input
                    id="valor"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formulario.valor}
                    onChange={(event) =>
                      atualizarCampo(
                        "valor",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="data">
                  Data
                </label>

                <input
                  id="data"
                  type="date"
                  value={formulario.data}
                  onChange={(event) =>
                    atualizarCampo(
                      "data",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="formaPagamento">
                Forma de pagamento
              </label>

              <select
                id="formaPagamento"
                value={
                  formulario.formaPagamento
                }
                onChange={(event) =>
                  atualizarCampo(
                    "formaPagamento",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecione
                </option>

                {formasPagamento.map(
                  (forma) => (
                    <option
                      key={forma}
                      value={forma}
                    >
                      {forma}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={limparFormulario}
              >
                Limpar
              </button>

              <button
                type="submit"
                className="btn-primary"
              >
                <i className="bi bi-plus-lg"></i>

                Adicionar despesa
              </button>
            </div>
          </form>
        </section>

        <section className="despesa-list-card">
          <div className="section-header">
            <div>
              <h2>Despesas cadastradas</h2>

              <p>
                Histórico das suas despesas.
              </p>
            </div>

            <span className="despesa-count">
              {despesas.length}
            </span>
          </div>

          {carregando ? (
            <div className="despesa-empty">
              <i className="bi bi-arrow-repeat"></i>

              <p>
                Carregando despesas...
              </p>
            </div>
          ) : despesas.length === 0 ? (
            <div className="despesa-empty">
              <i className="bi bi-receipt"></i>

              <h3>
                Nenhuma despesa cadastrada
              </h3>

              <p>
                Cadastre sua primeira despesa
                utilizando o formulário.
              </p>
            </div>
          ) : (
            <div className="despesas-list">
              {despesas.map((despesa) => (
                <article
                  key={despesa.id}
                  className="despesa-item"
                >
                  <div>
                    <strong>
                      {despesa.descricao}
                    </strong>

                    <span>
                      {despesa.data}
                    </span>
                  </div>

                  <strong>
                    R$ {despesa.valor}
                  </strong>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Despesas;