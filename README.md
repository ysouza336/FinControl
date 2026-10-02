# 💰 FinControl Pro

Sistema web de controle financeiro pessoal desenvolvido com **React, Vite e Firebase**.

O FinControl Pro tem como objetivo centralizar o controle financeiro pessoal, permitindo acompanhar receitas, despesas, financiamentos, reservas e indicadores financeiros em uma única aplicação.

O projeto está sendo desenvolvido de forma incremental através de **Sprints**, com validação funcional ao final de cada etapa.

---

# 🚀 Tecnologias

## Front-end

* React
* Vite
* React Router DOM
* React Hook Form
* Zod
* SCSS
* Bootstrap
* Bootstrap Icons
* Recharts

## Backend / Serviços

* Firebase Authentication
* Firebase Firestore

---

# 🏗️ Arquitetura atual

```text
src/
│
├── components/
│   ├── Header/
│   ├── Sidebar/
│   └── MainLayout/
│
├── contexts/
│   └── AuthContext.jsx
│
├── pages/
│   ├── Dashboard/
│   ├── Receitas/
│   ├── Despesas/
│   ├── Financiamento/
│   ├── Relatorios/
│   ├── Configuracoes/
│   └── Login/
│
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── services/
│   ├── firebase.js
│   └── firestore.js
│
└── styles/
    ├── global.scss
    └── login.scss
```

---

# 🔐 Autenticação

O sistema utiliza o **Firebase Authentication** para gerenciamento das contas.

Atualmente estão implementados:

* Cadastro de usuário
* Login
* Logout
* Persistência da sessão
* Identificação do usuário autenticado
* Proteção das rotas
* Redirecionamento de usuários não autenticados
* Exibição do usuário no Header

Método de autenticação atual:

```text
E-mail + Senha
```

---

# ☁️ Firestore

O Firestore é utilizado como banco de dados da aplicação.

A estrutura inicial implementada é:

```text
users
└── {uid}
    ├── uid
    ├── email
    ├── nome
    └── atualizadoEm
```

Cada usuário possui seu próprio documento identificado pelo UID do Firebase Authentication.

A estrutura será expandida durante os próximos Sprints.

---

# 🛡️ Segurança

As rotas principais são protegidas através do:

```text
ProtectedRoute
```

Usuários não autenticados são direcionados para:

```text
/login
```

As regras atuais do Firestore garantem que o usuário autenticado somente possa acessar seu próprio documento.

Para as receitas, a estrutura de segurança planejada é:

```javascript
match /users/{userId}/receitas/{receitaId} {
  allow read, write: if request.auth != null
                     && request.auth.uid == userId;
}
```

As regras de outras coleções serão adicionadas conforme os respectivos módulos forem desenvolvidos.

---

# 📊 Funcionalidades planejadas

## Dashboard

* Resumo financeiro
* Total de receitas
* Total de despesas
* Saldo disponível
* Reserva financeira
* Acompanhamento do financiamento
* Indicadores financeiros
* Gráficos financeiros

---

## Receitas

* Cadastro de receitas fixas
* Cadastro de receitas variáveis
* Categorias
* Data
* Descrição
* Valor
* KM percorridos
* Horas trabalhadas
* Cálculo de R$/KM
* Cálculo de R$/Hora
* Listagem
* Edição
* Exclusão

### Receita variável

Para receitas relacionadas a atividades por deslocamento ou trabalho por hora, será possível informar:

```text
Valor recebido
KM percorridos
Horas trabalhadas
```

O sistema calculará automaticamente:

```text
R$/KM
R$/Hora
```

Não serão criados gráficos específicos para KM/Hora.

---

## Despesas

* Cadastro de despesas
* Categorias
* Descrição
* Data
* Valor
* Forma de pagamento
* Edição
* Exclusão

---

## Financiamento Veicular

* Cadastro do veículo
* Banco
* Valor financiado
* Entrada
* Número de parcelas
* Valor da parcela
* Primeiro vencimento
* Geração das parcelas
* Controle de parcelas pagas
* Progresso do financiamento
* Valor restante

---

## Reserva Financeira

O sistema terá como objetivo inicial reservar automaticamente:

```text
30% da renda
```

O percentual será configurável futuramente.

---

## Relatórios

Serão implementados:

* Receitas x despesas
* Despesas por categoria
* Evolução da reserva
* Evolução do saldo
* Indicadores financeiros
* Gráficos financeiros

---

# 📅 Sprints

## Sprint 01 — Fundação

**Status: ✅ Concluído**

Implementado:

* Criação do projeto React + Vite
* Estrutura inicial da aplicação
* React Router
* Layout principal
* Sidebar
* Header
* Dashboard inicial
* Páginas principais
* Bootstrap
* Bootstrap Icons
* SCSS
* Navegação entre páginas
* Estrutura preparada para evolução do sistema

---

# Sprint 02 — Firebase, Authentication e Firestore

**Status: ✅ Concluído**

### 2.1 — Projeto Firebase

✅ Projeto FinControl Pro criado no Firebase.

### 2.2 — Configuração Firebase

✅ Firebase integrado ao React através de variáveis de ambiente.

### 2.3 — AuthContext

✅ Criado contexto responsável pelo gerenciamento da autenticação.

Implementado:

* Usuário atual
* Estado de carregamento
* Cadastro
* Login
* Logout
* Monitoramento da sessão

### 2.4 — Login e Cadastro

✅ Tela de autenticação criada.

Implementado:

* Login
* Cadastro
* Confirmação de senha
* Mensagens de erro
* Mensagens de sucesso
* Loading durante operações
* Integração com Firebase Authentication

### 2.5 — Rotas Protegidas

✅ Criado `ProtectedRoute`.

Usuários não autenticados são direcionados automaticamente para:

```text
/login
```

### 2.6 — Firestore

✅ Firestore integrado.

Criado:

```text
src/services/firestore.js
```

Implementado:

* Criação do perfil do usuário
* Busca do perfil
* Referência do documento do usuário

Estrutura:

```text
users/{uid}
```

### 2.7 — Usuário no Header

✅ Header integrado ao usuário autenticado.

Agora são exibidos:

* Nome do usuário
* E-mail
* Avatar
* Informações da conta

### 2.8 — Logout

✅ Logout implementado.

Fluxo:

```text
Dashboard
    ↓
Logout
    ↓
Firebase signOut()
    ↓
/login
```

### 2.9 — Testes

✅ Sprint 02 validado completamente.

Foram testados:

* Cadastro
* Login
* Logout
* Persistência da sessão
* Atualização da página
* Proteção das rotas
* Firestore
* Criação do perfil
* Regras de segurança
* Usuário no Header
* Retorno ao login após logout
* Bloqueio das páginas sem autenticação

### 2.10 — Documentação

✅ README atualizado.

---

# 🚀 Sprint 03 — Receitas

**Status: 🟡 Em andamento**

## Objetivo

Criar o módulo completo de gerenciamento de receitas financeiras.

A primeira versão trabalhará com dois tipos:

```text
Receita Fixa
Receita Variável
```

---

## Task 3.1 — Estrutura Firestore

**Status: 🟡 Em andamento**

Será criada a estrutura:

```text
users
└── {uid}
    └── receitas
        └── {receitaId}
```

As regras do Firestore serão configuradas para permitir que cada usuário acesse somente suas próprias receitas.

---

## Task 3.2 — Serviço de Receitas

Será criado o serviço responsável pela comunicação entre o React e o Firestore.

Funções planejadas:

```text
salvarReceita()
buscarReceitas()
buscarReceita()
atualizarReceita()
excluirReceita()
```

---

## Task 3.3 — Contexto de Receitas

Será criado um contexto específico para gerenciamento das receitas.

Responsabilidades:

* Estado das receitas
* Carregamento
* Cadastro
* Atualização
* Exclusão
* Consulta
* Integração com usuário autenticado

---

## Task 3.4 — Formulário

Será criada a interface para cadastro de receitas.

Campos planejados:

```text
Tipo
Categoria
Descrição
Valor
Data
```

Para receitas variáveis:

```text
KM
Horas trabalhadas
```

---

## Task 3.5 — Receita Fixa

Implementação do cadastro de receitas fixas.

Exemplo:

```text
Tipo: Fixa
Descrição: Salário
Valor: R$ 4.000,00
Data: 05/10/2026
```

---

## Task 3.6 — Receita Variável

Implementação das receitas variáveis.

Exemplo:

```text
Tipo: Variável
Descrição: Trabalho extra

Valor: R$ 450,00
KM: 300
Horas: 10
```

Cálculos:

```text
R$/KM = Valor ÷ KM

R$/Hora = Valor ÷ Horas
```

Exemplo:

```text
R$ 450 ÷ 300 KM
= R$ 1,50/KM

R$ 450 ÷ 10 horas
= R$ 45,00/hora
```

---

## Task 3.7 — Lista de Receitas

Será criada a listagem das receitas cadastradas.

Informações:

* Data
* Tipo
* Categoria
* Descrição
* Valor
* R$/KM
* R$/Hora

---

## Task 3.8 — Edição e Exclusão

Será possível:

* Editar uma receita
* Excluir uma receita
* Atualizar os dados no Firestore

---

## Task 3.9 — Validações

Serão implementadas validações para:

* Valor obrigatório
* Data obrigatória
* Tipo obrigatório
* Categoria
* KM
* Horas
* Valores maiores que zero
* Campos específicos de receitas variáveis

Será utilizado:

```text
React Hook Form
+
Zod
```

---

## Task 3.10 — Dashboard

As receitas cadastradas começarão a alimentar o Dashboard.

Inicialmente serão utilizados dados reais para:

```text
Total de receitas
```

E posteriormente:

```text
Receitas
-
Despesas
=
Saldo
```

---

## Task 3.11 — Teste do Sprint

Será realizada uma validação completa:

* Cadastro
* Edição
* Exclusão
* Receita fixa
* Receita variável
* Cálculo R$/KM
* Cálculo R$/Hora
* Persistência no Firestore
* Isolamento por usuário
* Dashboard
* Responsividade básica

---

## Task 3.12 — README

Atualização da documentação após a conclusão do Sprint 03.

---

# 🗺️ Roadmap geral

```text
Sprint 01
Fundação
    ↓
Sprint 02
Firebase + Authentication
    ↓
Sprint 03
Receitas
    ↓
Sprint 04
Despesas
    ↓
Sprint 05
Financiamento Veicular
    ↓
Sprint 06
Reserva Financeira
    ↓
Sprint 07
Dashboard
    ↓
Sprint 08
Relatórios
    ↓
Sprint 09
Responsividade + Mobile UX
    ↓
Sprint 10
Segurança + Testes + Deploy
```

---

# ▶️ Executando o projeto

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O projeto utiliza variáveis de ambiente para as configurações do Firebase.

O arquivo `.env` não deve ser enviado ao GitHub.

---

# 🧪 Estado atual

```text
Sprint 01  ✅
Sprint 02  ✅
Sprint 03  🟡
Sprint 04  ⬜
Sprint 05  ⬜
Sprint 06  ⬜
Sprint 07  ⬜
Sprint 08  ⬜
Sprint 09  ⬜
Sprint 10  ⬜
```

---

# 📄 Licença

Projeto em desenvolvimento para fins de estudo, portfólio e evolução profissional.
