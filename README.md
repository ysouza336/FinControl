# FinControl Pro

Aplicação web de controle financeiro pessoal desenvolvida com React, Vite e Firebase. O objetivo é centralizar receitas, despesas e financiamentos em uma interface intuitiva, responsiva e com indicadores que facilitem o acompanhamento da vida financeira.

## 📌 Status do projeto

- **Sprints concluídas:** 01 a 08
- **Autenticação:** Firebase Authentication
- **Persistência de dados:** Cloud Firestore
- **Interface:** React + SCSS
- **Gráficos:** Recharts
- **Situação:** funcionalidades implementadas e validadas durante o desenvolvimento.

---

## 🎯 Funcionalidades

### 1. Autenticação e usuários

- Cadastro de usuários.
- Login com e-mail e senha.
- Integração com Firebase Authentication.
- Organização dos dados financeiros por usuário.
- Integração com Firestore para persistência dos registros.

### 2. Receitas

- Cadastro e gerenciamento de receitas.
- Classificação entre receitas fixas e variáveis.
- Registro de valores e datas.
- Consulta das receitas por período.
- Cálculo automático dos totais mensais.

### 3. Despesas

- Cadastro e gerenciamento de despesas.
- Classificação por categoria.
- Registro de descrição, valor, data e forma de pagamento.
- Consulta de despesas por mês.
- Consolidação dos gastos no Dashboard.

### 4. Financiamentos

- Cadastro de financiamentos e suas parcelas.
- Acompanhamento do valor comprometido.
- Identificação de parcelas pagas e pendentes.
- Atualização do status das parcelas.
- Cálculo do total pago e do saldo restante.
- Visualização dos totais gerais independentemente do mês selecionado no Dashboard.

### 5. Dashboard financeiro

- Seleção do mês para consulta.
- Indicadores de receitas, despesas, reserva e saldo.
- Separação entre receitas fixas e variáveis.
- Detalhamento da composição financeira.
- Quantidade de movimentações do período.
- Resumo geral dos financiamentos.
- Mensagens informativas para meses sem movimentações.
- Destaque visual para resultados positivos, negativos e zerados.

### 6. Reserva financeira automática

O Dashboard calcula uma reserva recomendada correspondente a **30% das receitas fixas do mês selecionado**.

Regras implementadas:

- A reserva considera somente as receitas classificadas como fixas.
- As receitas variáveis não entram no cálculo da reserva.
- O saldo antes da reserva corresponde às receitas totais menos as despesas.
- O saldo após a reserva corresponde ao saldo antes da reserva menos a reserva recomendada.
- Consultar meses anteriores não deve alterar os registros financeiros no Firebase.

**Fórmulas utilizadas:**

Reserva recomendada:

`Reserva = Total de receitas fixas × 0,30`

Saldo antes da reserva:

`Saldo = Total de receitas − Total de despesas`

Saldo após a reserva:

`Saldo disponível = Saldo − Reserva`

A reserva é uma recomendação calculada pelo sistema, não uma transferência bancária automática.

### 7. Gráficos financeiros

Implementados na Sprint 08 com Recharts:

- **Receitas x despesas:** comparação entre receitas fixas, receitas variáveis e despesas do período.
- **Despesas por categoria:** gráfico de rosca com distribuição dos gastos.
- **Resultado financeiro:** visualização do saldo antes da reserva, da reserva recomendada e do saldo após a reserva.

Os gráficos acompanham o mês selecionado, apresentam valores monetários em reais e possuem estados vazios para períodos sem movimentações.

Também foram realizados ajustes nos tooltips, na visualização de valores negativos e na responsividade.

### 8. Calculadora de ganhos por veículo

O projeto contempla uma funcionalidade de apoio ao cálculo de renda extra utilizando veículo, com foco em:

- Cálculos baseados em quilometragem.
- Cálculos baseados em horas trabalhadas.

A proposta é estimar os ganhos de forma prática, sem transformar essa funcionalidade em um painel de aplicativo de transporte.

---

## 🧰 Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface |
| Vite | Ambiente de desenvolvimento e build |
| JavaScript | Lógica da aplicação |
| SCSS | Estilização e responsividade |
| React Router | Navegação entre páginas |
| Firebase Authentication | Autenticação de usuários |
| Cloud Firestore | Persistência dos dados |
| Recharts | Visualização de gráficos |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de dados |
| Bootstrap / Bootstrap Icons | Componentes visuais e ícones |

---

## 📁 Organização do projeto

A estrutura abaixo representa a organização geral adotada. Os nomes exatos de alguns arquivos podem variar conforme a implementação atual.

```text
FinControl-Pro/
├── public/
├── src/
│   ├── components/
│   ├── constants/
│   │   └── categoriasDespesas.js
│   ├── contexts/
│   │   ├── ReceitasContext.jsx
│   │   ├── DespesasContext.jsx
│   │   └── FinanciamentosContext.jsx
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Receitas/
│   │   ├── Despesas/
│   │   └── Financiamento/
│   ├── services/
│   │   ├── despesas.js
│   │   └── firebase.js
│   ├── styles/
│   │   └── dashboard.scss
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- Node.js em uma versão compatível com a versão do Vite utilizada.
- npm.
- Git, caso queira clonar o repositório.
- Uma conta Firebase com Authentication e Cloud Firestore configurados.

## 🚀 Instalação e execução

### 1. Obtenha o código

Caso o projeto esteja em um repositório Git:

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DA_PASTA
```

Se já estiver trabalhando na pasta local, abra o terminal nessa pasta.

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

Crie ou confira o projeto no console do Firebase.

Habilite o método de autenticação por e-mail e senha e configure o Cloud Firestore.

Confira o arquivo de configuração Firebase existente no projeto. Caso ele utilize variáveis de ambiente, configure o arquivo `.env.local` com os nomes de variáveis esperados pelo código.

Exemplo de nomenclatura comum em projetos Vite:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

Os nomes e valores
