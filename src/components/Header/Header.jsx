import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const nomeUsuario =
    usuario?.displayName ||
    usuario?.email?.split("@")[0] ||
    "Usuário";

  const emailUsuario =
    usuario?.email || "Conta FinControl";

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  }

  return (
    <header className="app-header">
      <div>
        <span className="header-welcome">
          Bem-vindo ao
        </span>

        <h2>FinControl</h2>
      </div>

      <div className="header-actions">
        <button
          className="header-icon-button"
          type="button"
          aria-label="Notificações"
        >
          <i className="bi bi-bell"></i>
        </button>

        <div className="header-user">
          <div className="user-avatar">
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="user-info">
            <strong>{nomeUsuario}</strong>
            <span>{emailUsuario}</span>
          </div>

          <button
            className="header-logout-button"
            type="button"
            onClick={handleLogout}
            aria-label="Sair da conta"
            title="Sair"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;