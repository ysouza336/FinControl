import { useMemo } from "react";

import { useReceitas } from "../../contexts/ReceitasContext";

import "../../styles/dashboard.scss";

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function obterMesAtual() {
  const agora = new Date();

  return {
    mes: agora.getMonth(),
    ano: agora.getFullYear(),
  };
}

function receitaPertenceAoMesAtual(data) {
  if (!data) {
    return false;
  }

  const [ano, mes] = data.split("-").map(Number);

  const mesAtual = obterMesAtual();

  return (
    ano === mesAtual.ano &&
    mes - 1 === mesAtual.mes
  );
}

function Dashboard() {
  const {
    receitas,
    carregando: carregandoReceitas,
  } = useReceitas();

  const indicadores = useMemo(() => {
    const total = receitas.reduce(
      (acumulado, receita) =>
        acumulado + Number(receita.valor || 0),
      0
    );

    const totalMesAtual = receitas
      .filter((receita) =>
        receitaPertenceAoMesAtual(receita.data)
      )
      .reduce(
        (acumulado, receita) =>
          acumulado + Number(receita.valor || 0),
        0
      );

    const totalFixo = receitas
      .filter((receita) => receita.tipo === "fixa")
      .reduce(
        (acumulado, receita) =>
          acumulado + Number(receita.valor || 0),
        0
      );

    const totalVariavel = receitas
      .filter((receita) => receita.tipo === "variavel")
      .reduce(
        (acumulado, receita) =>
          acumulado + Number(receita.valor || 0),
        0
      );

    return {
      total,
      totalMesAtual,
      totalFixo,
      totalVariavel,
      quantidade: receitas.length,
    };
  }, [receitas]);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Acompanhe sua situação financeira.
          </p>
        </div>
      </div>

      <section className="dashboard-summary">
        <article className="dashboard-card dashboard-card-primary">
          <div className="dashboard-card-icon">
            <i className="bi bi-wallet2"></i>
          </div>

          <div>
            <span>Total de receitas</span>

            <strong>
              {carregandoReceitas
                ? "Carregando..."
                : formatarMoeda(indicadores.total)}
            </strong>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">
            <i className="bi bi-calendar-check"></i>
          </div>

          <div>
            <span>Receitas deste mês</span>

            <strong>
              {carregandoReceitas
                ? "Carregando..."
                : formatarMoeda(
                    indicadores.totalMesAtual
                  )}
            </strong>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">
            <i className="bi bi-arrow-up-circle"></i>
          </div>

          <div>
            <span>Receitas fixas</span>

            <strong>
              {carregandoReceitas
                ? "Carregando..."
                : formatarMoeda(
                    indicadores.totalFixo
                  )}
            </strong>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">
            <i className="bi bi-lightning-charge"></i>
          </div>

          <div>
            <span>Receitas variáveis</span>

            <strong>
              {carregandoReceitas
                ? "Carregando..."
                : formatarMoeda(
                    indicadores.totalVariavel
                  )}
            </strong>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Resumo das receitas</h2>

              <p>
                Visão geral das receitas cadastradas.
              </p>
            </div>
          </div>

          <div className="dashboard-income-summary">
            <div className="income-summary-item">
              <span>Total cadastrado</span>

              <strong>
                {indicadores.quantidade}
              </strong>

              <small>receitas</small>
            </div>

            <div className="income-summary-item">
              <span>Receita fixa</span>

              <strong>
                {formatarMoeda(
                  indicadores.totalFixo
                )}
              </strong>

              <small>
                {indicadores.total > 0
                  ? `${(
                      (indicadores.totalFixo /
                        indicadores.total) *
                      100
                    ).toFixed(1)}% do total`
                  : "0% do total"}
              </small>
            </div>

            <div className="income-summary-item">
              <span>Receita variável</span>

              <strong>
                {formatarMoeda(
                  indicadores.totalVariavel
                )}
              </strong>

              <small>
                {indicadores.total > 0
                  ? `${(
                      (indicadores.totalVariavel /
                        indicadores.total) *
                      100
                    ).toFixed(1)}% do total`
                  : "0% do total"}
              </small>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Próximos módulos</h2>

              <p>
                Funcionalidades que serão integradas
                ao dashboard.
              </p>
            </div>
          </div>

          <div className="dashboard-coming-soon">
            <div>
              <i className="bi bi-bar-chart-line"></i>

              <span>
                Despesas
              </span>
            </div>

            <div>
              <i className="bi bi-car-front"></i>

              <span>
                Financiamento
              </span>
            </div>

            <div>
              <i className="bi bi-pie-chart"></i>

              <span>
                Relatórios
              </span>
            </div>

            <div>
              <i className="bi bi-piggy-bank"></i>

              <span>
                Reserva de 30%
              </span>
            </div>
          </div>
        </article>
      </section>

      {receitas.length === 0 && !carregandoReceitas && (
        <section className="dashboard-empty">
          <div className="dashboard-empty-icon">
            <i className="bi bi-wallet"></i>
          </div>

          <h2>Nenhuma receita cadastrada</h2>

          <p>
            Cadastre sua primeira receita para começar
            a acompanhar sua vida financeira pelo
            Dashboard.
          </p>
        </section>
      )}
    </div>
  );
}

export default Dashboard;