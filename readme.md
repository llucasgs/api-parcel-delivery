# 📦🚚 Parcel Delivery API

API REST para gestão de entregas, construída com **Node.js + TypeScript + Prisma + JWT + Zod** e focada em segurança, escalabilidade, arquitetura limpa e testes automatizados.

É uma API robusta, usada como base de sistemas reais de logística e entregas.

---

## 🏷️ Badges das Tecnologias Utilizadas

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![Prisma ORM](https://img.shields.io/badge/Prisma-5.x-2D3748?logo=prisma)
![Zod](https://img.shields.io/badge/Zod-3.x-3068B7)
![JWT](https://img.shields.io/badge/JWT-9.x-000000?logo=jsonwebtokens)
![bcrypt](https://img.shields.io/badge/bcrypt-5.x-3381FF)

### Testes

![Jest](https://img.shields.io/badge/Jest-29.x-C21325?logo=jest)
![TSX](https://img.shields.io/badge/TSX-4.x-3178C6)

---

## 📘 Resumo

Imagine que você tem uma empresa de entregas.  
A API **Parcel Delivery** é o “cérebro” responsável por:

- criação de usuários
- autenticação
- criação de entregas
- alteração de status
- geração automática e manual de logs
- controle de acesso por papéis (RBAC)
- renovação de tokens (refresh token)

Ela funciona como uma _central logística digital._

---

## 🎯 Objetivo do Projeto

Esta API foi construída para:

✔ Ser **segura** (JWT + Refresh Token + RBAC)  
✔ Ser **escalável** (Prisma + arquitetura em camadas)  
✔ Ser **fácil de manutenção** (Services, Repositories, Schemas Zod)  
✔ Ser **confiável** (testes unitários com Jest)  
✔ Ser **profissional** (estrutura usada em empresas reais)

---

## 🏛️ Arquitetura do Projeto

```plaintext
src/
├─ 📁 controllers → Entrada das requisições HTTP
├─ ⚙️ services → Lógica de negócio
├─ 🗄️ repositories → Persistência (Prisma)
├─ 🧪 schemas → Validação com Zod
├─ 🛡️ middlewares → Auth + Error Handler
├─ 🌐 routes → Rotas REST
├─ 🔧 utils → Utilitários
├─ 🗃️ database → Conexão Prisma
└─ 🚀 server.ts → Bootstrap da aplicação
```

Princípios aplicados:

- baixo acoplamento
- alta coesão
- testabilidade
- código limpo e previsível

---

## 🔐 Segurança

### ✔ JWT de curta duração (Access Token)

Protege rotas privadas. Expira rápido → mais seguro.

### ✔ Refresh Token armazenado no banco

Permite renovar sessões sem precisar da senha novamente.

### ✔ RBAC — Controle de Acesso Baseado em Função

- `sale` → **vendedor:** pode criar entrega, alterar status, criar e ver todos os logs
- `customer` → **cliente:** só vê suas próprias entregas

### ✔ Middlewares de segurança

- `ensureAuthenticated`
- `verifyUserAuthorization`

---

## 🗄️ Banco de Dados (**PostgreSQL** + **Prisma ORM**).

### Principais tabelas

- `users`
- `deliveries`
- `delivery_logs`
- `refresh_tokens`

Inclui:

- relacionamentos 1:N
- cascades
- índices e constraints
- migrações gerenciadas pelo Prisma

---

## 📦 Funcionalidades da API

### 👤 Usuários

- Cadastro de usuários
- Login
- Renovação de sessão via refresh token

### 🚚 Entregas

- Criar entrega (somente `sale`)
- Listar entregas (somente `sale`)
- Atualizar status (`processing → shipped → delivered`)
- Gerar log automaticamente ao mudar status

### 📝 Logs de entrega

- Criar logs
- Listar logs
  - `sale` vê tudo
  - `customer` vê apenas suas entregas

---

## 🔐 Fluxo de Autenticação

1. Usuário faz login → recebe access_token (15m) e refresh_token (7 dias)
2. A cada requisição privada → envia Authorization: Bearer <token>
3. Quando o token expira:
   - cliente chama /auth/refresh
   - gera novo access_token
   - refresh antigo é invalidado

---

## 📡 Rotas da API

| Método | Rota                   | Descrição                   | Permissão       |
| ------ | ---------------------- | --------------------------- | --------------- |
| POST   | /users                 | Criar usuário               | Público         |
| POST   | /auth/login            | Criar sessão para Login     | Público         |
| POST   | /auth/refresh          | Renovar Access Token        | Público         |
| POST   | /deliveries            | Criar entrega               | sale            |
| GET    | /deliveries            | Listar entregas             | sale            |
| PATCH  | /deliveries/:id/status | Atualizar status da entrega | sale            |
| POST   | /deliveries/:id/logs   | Criar log manual p/ entrega | sale            |
| GET    | /deliveries/:id/logs   | Listar logs de uma entrega  | sale / customer |

---

## 🔧 Como Executar o Projeto

### 1. Instale as dependências:

```bash
npm install
```

### 2. Configure variáveis de ambiente (.env):

```bash
DATABASE_URL="postgresql://postgres:senha@localhost:5432/parcel_delivery"
JWT_SECRET="uma_chave_bem_forte"
JWT_EXPIRES_IN="15m"
```

### 3. Rode as migrations:

```bash
npx prisma migrate dev
```

### 4. Inicie o servidor:

```bash
npm run dev
```

A API rodará em:
http://localhost:3333

---

## 🧪 Testes Automatizados

O projeto possui testes unitários com Jest:

- Mock de repositórios
- Mock de bcrypt
- Mock de JWT
- Mock de crypto.randomUUID
- Validação de regras de negócio

### 1. Para rodar os testes:

```bash
npm test
```

### 2. Testar continuamente:

```bash
npm test
```

### 3. Cobertura:

```bash
npm run test:coverage
```

---

## 📡 Exemplos de Requisição

### Criar usuário:

```bash
POST /users
{
  "name": "Lucas",
  "email": "lucas@example.com",
  "password": "123456"
}
```

### Login:

```bash
POST /sessions
{
  "email": "lucas@example.com",
  "password": "123456"
}
```

### Resposta:

```bash
{
	"user": {
		"id": "1baae719-0a91-4d58-96ab-bc2f9e64b066",
		"name": "Lucas Garcia e Silva",
		"email": "lucas@hotmail.com",
		"role": "sale",
		"createdAt": "2025-11-22T22:36:22.747Z",
		"updatedAt": "2025-11-22T22:37:01.236Z"
	},
	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2FsZSIsImlhdCI6MTc2NDI1NTc2NCwiZXhwIjoxNzY0MzQyMTY0LCJzdWIiOiIxYmFhZTcxOS0wYTkxLTRkNTgtOTZhYi1iYzJmOWU2NGIwNjYifQ.n_fVX7ZgFYul94osGhzy4WiUR2r4ope23EiDovHcUNI",
	"refresh_token": "6aee802f-0d7e-432b-a3b9-f08efa23d5ca"
}
```

---

## 🧠 Por que esse projeto é especial?

Porque segue padrões profissionais usados em empresas modernas:

- Arquitetura limpa
- Services e Repositories bem separados
- Validação com Zod (evita erros antes de chegar na regra de negócio)
- Testes unitários robustos
- JWT + Refresh Token com controle de segurança
- Logs automáticos de auditoria
- Código organizado e escalável - Mock de repositórios

---

# 🤝 Contribuição

Pull Requests são bem-vindos!
Sugestões, melhorias e ideias de evolução também.

---

# 👨‍💻 Autor

### Lucas Garcia e Silva

Desenvolvedor FullStack
