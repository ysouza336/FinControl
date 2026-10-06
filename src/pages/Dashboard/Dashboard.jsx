import { useMemo } from "react";

import { useReceitas } from "../../contexts/ReceitasContext";
import { useDespesas } from "../../contexts/DespesasContext";

import "../../styles/dashboard.scss"

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

function obterTotal(lista) {
  return lista.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );
}

export default function Dashboard() {
  const {
    receitas,
    carregando: carregandoReceitas,
  } = useReceitas();

  const {
    despesas,
    carregando: carregandoDespesas,
  } = useDespesas();

  const resumoFinanceiro = useMemo(() => {
    const totalReceitas = obterTotal(receitas);
    const totalDespesas = obterTotal(despesas);

    const saldo = totalReceitas - totalDespesas;

    const percentualDespesas =
      totalReceitas > 0
        ? (totalDespesas / totalReceitas) * 100
        : 0;

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      percentualDespesas,
    };
  }, [receitas, despesas]);

  const carregando =
    carregandoReceitas ||
    carregandoDespesas;

  const saldoPositivo =
    resumoFinanceiro.saldo >= 0;

  return (
    <main className="pagina-dashboard">
      <section className="dashboard-cabecalho">
        <div>
          <span className="dashboard-cabecalho__eyebrow">
            Visão geral
          </span>

          <h1>Dashboard</h1>

          <p>
            Acompanhe sua situação financeira
            em um único lugar.
          </p>
        </div>
      </section>

      {carregando ? (
        <section className="dashboard-estado">
          Carregando informações financeiras...
        </section>
      ) : (
        <>
          <section className="dashboard-resumo">
            <article className="dashboard-card dashboard-card--receita">
              <span className="dashboard-card__rotulo">
                Total de receitas
              </span>

              <strong>
                {formatarMoeda(
                  resumoFinanceiro.totalReceitas
                )}
              </strong>

              <small>
                {receitas.length}{" "}
                {receitas.length === 1
                  ? "receita cadastrada"
                  : "receitas cadastradas"}
              </small>
            </article>

            <article className="dashboard-card dashboard-card--despesa">
              <span className="dashboard-card__rotulo">
                Total de despesas
              </span>

              <strong>
                {formatarMoeda(
                  resumoFinanceiro.totalDespesas
                )}
              </strong>

              <small>
                {despesas.length}{" "}
                {despesas.length === 1
                  ? "despesa cadastrada"
                  : "despesas cadastradas"}
              </small>
            </article>

            <article
              className={`dashboard-card ${
                saldoPositivo
                  ? "dashboard-card--saldo"
                  : "dashboard-card--negativo"
              }`}
            >
              <span className="dashboard-card__rotulo">
                Saldo atual
              </span>

              <strong>
                {formatarMoeda(
                  resumoFinanceiro.saldo
                )}
              </strong>

              <small>
                {saldoPositivo
                  ? "Saldo positivo"
                  : "Saldo negativo"}
              </small>
            </article>

            <article className="dashboard-card dashboard-card--percentual">
              <span className="dashboard-card__rotulo">
                Despesas / receitas
              </span>

              <strong>
                {resumoFinanceiro.percentualDespesas.toLocaleString(
                  "pt-BR",
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }
                )}
                %
              </strong>

              <small>
                Percentual da receita comprometido
              </small>
            </article>
          </section>

          <section className="dashboard-detalhes">
            <article className="dashboard-painel">
              <div className="dashboard-painel__cabecalho">
                <div>
                  <h2>Resumo financeiro</h2>

                  <p>
                    Resultado calculado com base
                    nos registros cadastrados.
                  </p>
                </div>
              </div>

              <div className="dashboard-financeiro">
                <div className="dashboard-financeiro__linha">
                  <span>
                    Receitas
                  </span>

                  <strong className="dashboard-financeiro__receita">
                    {formatarMoeda(
                      resumoFinanceiro.totalReceitas
                    )}
                  </strong>
                </div>

                <div className="dashboard-financeiro__linha">
                  <span>
                    Despesas
                  </span>

                  <strong className="dashboard-financeiro__despesa">
                    {formatarMoeda(
                      resumoFinanceiro.totalDespesas
                    )}
                  </strong>
                </div>

                <div className="dashboard-financeiro__separador" />

                <div className="dashboard-financeiro__linha dashboard-financeiro__linha--saldo">
                  <span>
                    Saldo
                  </span>

                  <strong
                    className={
                      saldoPositivo
                        ? "dashboard-financeiro__saldo"
                        : "dashboard-financeiro__saldo dashboard-financeiro__saldo--negativo"
                    }
                  >
                    {formatarMoeda(
                      resumoFinanceiro.saldo
                    )}
                  </strong>
                </div>
              </div>
            </article>

            <article className="dashboard-painel">
              <div className="dashboard-painel__cabecalho">
                <div>
                  <h2>Movimentações</h2>

                  <p>
                    Quantidade de registros
                    financeiros.
                  </p>
                </div>
              </div>

              <div className="dashboard-movimentacoes">
                <div className="dashboard-movimentacao">
                  <span>
                    Receitas
                  </span>

                  <strong>
                    {receitas.length}
                  </strong>
                </div>

                <div className="dashboard-movimentacao">
                  <span>
                    Despesas
                  </span>

                  <strong>
                    {despesas.length}
                  </strong>
                </div>

                <div className="dashboard-movimentacao">
                  <span>
                    Total
                  </span>

                  <strong>
                    {receitas.length +
                      despesas.length}
                  </strong>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}