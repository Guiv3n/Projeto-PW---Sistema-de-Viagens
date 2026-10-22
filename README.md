# Sistema de Gestão de Viagens

Aplicação Web Progressiva (PWA) desenvolvida como trabalho prático para a disciplina de Programação Web (CC — IFSUL Campus Passo Fundo). O sistema permite o gerenciamento completo de destinos turísticos, clientes e pacotes de viagens vinculados.

---

##  Links de Entrega e Produção

* **Aplicação em Produção (Frontend Vercel):** [https://projeto-pw-sistema-de-viagens.vercel.app](https://projeto-pw-sistema-de-viagens.vercel.app)
* **API em Produção (Backend Render):** [https://projeto-pw-sistema-de-viagens.onrender.com](https://projeto-pw-sistema-de-viagens.onrender.com)
* **Repositório GitHub:** `https://github.com/Guiv3n/Projeto-PW---Sistema-de-Viagens`

---

##  Tecnologias Utilizadas

* **Frontend:** React, TypeScript, Vite, React Router DOM, React-Bootstrap, Bootstrap Icons.
* **Backend:** Node.js, Express, Drizzle ORM, CORS.
* **Banco de Dados:** PostgreSQL hospedado em nuvem via **Neon.tech**.
* **Deploy e Nuvem:** 
  * Frontend: **Vercel** (com suporte a rotas SPA via `vercel.json`).
  * Backend: **Render** (Web Service Node.js).
  * Database: **Neon** (PostgreSQL Serverless).

---

##  Atendimento aos Requisitos da Disciplina

### 1. Banco de Dados e API 
* **Modelagem Relacional (≥ 3 tabelas):**
  * `destinos`: ID, cidade, país, clima.
  * `clientes`: ID, nome, email, telefone.
  * `pacotes`: ID, título, preço, data de embarque, vagas, status ativo e `destino_id` (**Chave Estrangeira** referenciando `destinos.id` com `ON DELETE CASCADE`).
* **CRUD Completo:** Endpoints REST implementados para todas as operações (`GET`, `POST`, `PUT`, `DELETE`) em cada uma das três tabelas.

### 2. Frontend e PWA 
* **CRUD Visual:** Interface responsiva com tabelas de listagem, modais para cadastro e edição, e confirmação de exclusão.
* **Regras de Negócio e Validações:**
  * **Destinos:** Seleção padronizada de países e climas pré-definidos.
  * **Clientes:** Validação de nome e sobrenome (mínimo 3 caracteres cada), formato de e-mail e máscara dinâmica para telefones brasileiros `(XX) XXXXX-XXXX`.
  * **Pacotes:** Preenchimento dinâmico do destino via `<select>`, bloqueio de datas passadas (`min` data atual), preço positivo e número de vagas maior que zero.
* **PWA:** Configurado com `manifest.json`, suporte a exibição `standalone`, ícones e tema.

### 3. Hospedagem em Nuvem 
* Backend e Frontend hospedados e comunicando-se publicamente na nuvem (Render + Vercel + Neon).

---

##  Guia de Navegação no Código

Use este mapa caso a professora peça para você abrir e explicar os arquivos no VS Code:

###  Backend (`viagens_api/`)
* **`src/db/schema.js`**: Contém a definição das tabelas Drizzle ORM, incluindo a Foreign Key de `pacotes.destino_id` referenciando `destinos.id`.
* **`src/db/connection.js`**: Configuração do pool de conexão PostgreSQL utilizando a variável `DATABASE_URL`.
* **`src/index.js`**: Ponto de entrada do servidor Express. Aqui estão configurados o middleware de CORS, parser JSON e todos os endpoints das rotas CRUD.

###  Frontend (`viagens_frontend/`)
* **`src/services/api.ts`**: Centraliza a URL base da API em nuvem (`onrender.com`).
* **`src/utils/validacoes.ts`**: Funções puras de máscara de telefone, validação de e-mail, nome composto e restrições de data/preço.
* **`src/pages/Destinos.tsx`**: Tela com o CRUD de destinos, usando listas controladas para clima e países.
* **`src/pages/Clientes.tsx`**: Tela do CRUD de clientes com feedback visual de validações (`isInvalid`).
* **`src/pages/Pacotes.tsx`**: Tela do CRUD de pacotes com integração relacional (dropdown buscando os destinos cadastrados no banco).
* **`public/manifest.json` e `index.html`**: Configurações de PWA (título, ícones, tema e viewport).
* **`vercel.json`**: Regras de rewrite para permitir navegação direta e F5 em rotas React Router em produção.

---

##  Execução Local

Caso queira rodar o projeto localmente:

```bash
# 1. Iniciar o Backend
cd viagens_api
npm install
node src/index.js

# 2. Iniciar o Frontend (em outro terminal)
cd viagens_frontend
npm install
npm run dev
