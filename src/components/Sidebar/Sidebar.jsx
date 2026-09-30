import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "bi-grid-1x2-fill",
    },
    {
      path: "/receitas",
      label: "Receitas",
      icon: "bi-arrow-up-circle",
    },
    {
      path: "/despesas",
      label: "Despesas",
      icon: "bi-arrow-down-circle",
    },
    {
      path: "/financiamento",
      label: "Financiamento",
      icon: "bi-car-front-fill",
    },
    {
      path: "/relatorios",
      label: "Relatórios",
      icon: "bi-bar-chart-fill",
    },
    {
      path: "/configuracoes",
      label: "Configurações",
      icon: "bi-gear-fill",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="bi bi-wallet2"></i>
        </div>

        <div>
          <h1>FinControl</h1>
          <span>Gestão Financeira</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">
          <i className="bi bi-shield-check"></i>
        </div>

        <div>
          <strong>Seus dados</strong>
          <small>Protegidos e seguros</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;