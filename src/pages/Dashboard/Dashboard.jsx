function Dashboard() {
  return (
    <section className="dashboard-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">Visão geral</span>
          <h1>Dashboard</h1>
          <p>
            Acompanhe sua situação financeira de forma simples e organizada.
          </p>
        </div>

        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i>
          Novo lançamento
        </button>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="summary-card">
            <div className="summary-card-top">
              <span>Saldo disponível</span>
              <div className="summary-icon">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>

            <strong>R$ 0,00</strong>

            <small>
              <i className="bi bi-info-circle"></i>
              Nenhum lançamento registrado
            </small>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="summary-card">
            <div className="summary-card-top">
              <span>Entradas</span>
              <div className="summary-icon">
                <i className="bi bi-arrow-up"></i>
              </div>
            </div>

            <strong>R$ 0,00</strong>

            <small>Este mês</small>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="summary-card">
            <div className="summary-card-top">
              <span>Despesas</span>
              <div className="summary-icon">
                <i className="bi bi-arrow-down"></i>
              </div>
            </div>

            <strong>R$ 0,00</strong>

            <small>Este mês</small>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="summary-card">
            <div className="summary-card-top">
              <span>Reserva</span>
              <div className="summary-icon">
                <i className="bi bi-piggy-bank"></i>
              </div>
            </div>

            <strong>R$ 0,00</strong>

            <small>Meta de 30%</small>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-8">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span>Movimentação</span>
                <h3>Entradas x Despesas</h3>
              </div>

              <button className="panel-filter">
                Este mês
                <i className="bi bi-chevron-down"></i>
              </button>
            </div>

            <div className="empty-chart">
              <i className="bi bi-bar-chart"></i>
              <strong>Sem dados suficientes</strong>
              <span>
                Cadastre suas receitas e despesas para visualizar o gráfico.
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <span>Financiamento</span>
                <h3>Veículo</h3>
              </div>

              <i className="bi bi-car-front panel-title-icon"></i>
            </div>

            <div className="financing-empty">
              <i className="bi bi-car-front"></i>

              <strong>Nenhum financiamento</strong>

              <span>
                Cadastre seu financiamento para acompanhar as parcelas.
              </span>

              <button className="btn btn-outline-primary">
                Cadastrar financiamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;