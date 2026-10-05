# 💰 FinControl Pro

Sistema de gerenciamento financeiro pessoal desenvolvido com React, Vite e Firebase.

O objetivo do projeto é centralizar receitas, despesas, financiamento veicular, metas financeiras e relatórios em uma única aplicação.

---

## 🚀 Tecnologias

- React
- Vite
- React Router DOM
- Firebase Authentication
- Firebase Firestore
- React Hook Form
- Zod
- SCSS
- Bootstrap
- Bootstrap Icons
- Recharts

---

## 📁 Estrutura principal

```text
src/
├── components/
│   ├── Header/
│   ├── MainLayout/
│   └── Sidebar/
│
├── contexts/
│   ├── AuthContext.jsx
│   └── ReceitasContext.jsx
│
├── pages/
│   ├── Dashboard/
│   ├── Receitas/
│   ├── Despesas/
│   ├── Financiamento/
│   ├── Relatorios/
│   └── Configuracoes/
│
├── services/
│   ├── firebase.js
│   ├── firestore.js
│   └── receitas.js
│
├── routes/
│   └── AppRoutes.jsx
│
└── styles/
    ├── global.scss
    ├── login.scss
    ├── receitas.scss
    └── dashboard.scss
