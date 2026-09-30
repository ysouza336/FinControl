import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/login.scss";

function Login() {
  const navigate = useNavigate();
  const { login, criarConta } = useAuth();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  function limparMensagens() {
    setErro("");
    setMensagem("");
  }

  function alternarModo() {
    limparMensagens();
    setSenha("");
    setConfirmarSenha("");
    setModoCadastro((modoAtual) => !modoAtual);
  }

  function traduzirErroFirebase(codigo) {
    const erros = {
      "auth/invalid-email": "Informe um e-mail válido.",
      "auth/user-not-found": "E-mail ou senha incorretos.",
      "auth/wrong-password": "E-mail ou senha incorretos.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
      "auth/weak-password": "A senha deve possuir pelo menos 6 caracteres.",
      "auth/missing-password": "Informe uma senha.",
      "auth/too-many-requests":
        "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    };

    return erros[codigo] || "Não foi possível concluir a operação. Tente novamente.";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    limparMensagens();

    if (!email.trim() || !senha) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    if (modoCadastro && senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      if (modoCadastro) {
        await criarConta(email.trim(), senha);

        setMensagem("Conta criada com sucesso!");

        setSenha("");
        setConfirmarSenha("");

        setTimeout(() => {
          navigate("/");
        }, 500);

        return;
      }

      await login(email.trim(), senha);

      navigate("/");
    } catch (error) {
        console.error("ERRO FIREBASE:", error);
        console.error("CÓDIGO:", error.code);
        console.error("MENSAGEM:", error.message);

        setErro(traduzirErroFirebase(error.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">
            <i className="bi bi-wallet2"></i>
          </div>

          <div>
            <h1>FinControl Pro</h1>
            <span>Controle financeiro inteligente</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>{modoCadastro ? "Criar conta" : "Bem-vindo de volta"}</h2>

            <p>
              {modoCadastro
                ? "Crie sua conta para começar a controlar suas finanças."
                : "Entre na sua conta para continuar."}
            </p>
          </div>

          {erro && (
            <div className="login-alert login-alert-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{erro}</span>
            </div>
          )}

          {mensagem && (
            <div className="login-alert login-alert-success">
              <i className="bi bi-check-circle"></i>
              <span>{mensagem}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">E-mail</label>

              <div className="login-input-wrapper">
                <i className="bi bi-envelope"></i>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  disabled={carregando}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="senha">Senha</label>

              <div className="login-input-wrapper">
                <i className="bi bi-lock"></i>

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete={
                    modoCadastro ? "new-password" : "current-password"
                  }
                  disabled={carregando}
                />
              </div>
            </div>

            {modoCadastro && (
              <div className="login-field">
                <label htmlFor="confirmarSenha">Confirmar senha</label>

                <div className="login-input-wrapper">
                  <i className="bi bi-shield-lock"></i>

                  <input
                    id="confirmarSenha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(event) =>
                      setConfirmarSenha(event.target.value)
                    }
                    placeholder="Digite a senha novamente"
                    autoComplete="new-password"
                    disabled={carregando}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>

                  <span>{modoCadastro ? "Criando conta..." : "Entrando..."}</span>
                </>
              ) : (
                <>
                  <span>{modoCadastro ? "Criar conta" : "Entrar"}</span>
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>ou</span>
          </div>

          <button
            type="button"
            className="login-switch"
            onClick={alternarModo}
            disabled={carregando}
          >
            {modoCadastro
              ? "Já tenho uma conta"
              : "Ainda não tenho uma conta"}
          </button>

          <Link to="/" className="login-back">
            <i className="bi bi-arrow-left"></i>
            Voltar para o sistema
          </Link>
        </div>

        <p className="login-footer">
          FinControl Pro &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default Login;