# 🛒 Projeto API Loja

Este projeto é uma **API RESTful completa** desenvolvida como requisito de avaliação do curso **Fullstack**.  
Ele implementa um **CRUD completo de Usuários, Categorias e Produtos**, incluindo:

- 🔗 Relacionamentos complexos no banco de dados
- 🔐 Autenticação com **JWT**
- 🧪 Testes automatizados
- ☁️ Suporte para deploy no **Render** com **PostgreSQL**

---

# 📚 Escopo do Projeto

Para a implementação desta API foram utilizadas as seguintes tecnologias:

| Tecnologia | Descrição |
|-------------|-----------|
| 🟢 **Node.js** | Permite executar JavaScript no servidor |
| ⚡ **Express.js** | Framework para criação de rotas e APIs |
| 🔐 **JWT (JSON Web Token)** | Autenticação e proteção de rotas |
| ⚙️ **Dotenv** | Gerenciamento de variáveis de ambiente |
| 🗄 **PostgreSQL / MySQL** | Banco de dados relacional (suporta ambos) |
| 🧠 **Sequelize (ORM)** | Mapeamento objeto-relacional e migrations |
| 🧪 **Jest & Supertest** | Testes automatizados de integração |

---

# 📁 Estrutura de Diretórios

```text
projeto-api-loja/
├── src/
│   ├── config/        # Configurações do projeto e banco de dados
│   ├── controllers/   # Lógica das rotas
│   ├── middleware/    # Middlewares (auth, validações etc.)
│   ├── migrations/    # Scripts de criação de tabelas do Sequelize
│   ├── models/        # Modelos do banco de dados (Product, User, Category)
│   ├── routes/        # Definição das rotas
│   ├── seeders/       # Inserção de dados iniciais
│   ├── app.js         # Configuração da aplicação (Express, CORS, Swagger)
│   ├── server.js      # Inicialização do servidor
│   └── setup_db.js    # Script auxiliar para rodar migrations/seeds
│
├── tests/             # Testes automatizados
├── .env               # Variáveis de ambiente (não versionado)
└── package.json
```

---

# 📡 Status Code das Respostas

A API segue os padrões REST para códigos de resposta:

| Código | Significado |
|---|---|
| ✅ 200 OK | A requisição foi executada com sucesso |
| 🆕 201 Created | Um novo recurso foi criado |
| 📭 204 No Content | Requisição executada sem retorno de conteúdo |
| ⚠️ 400 Bad Request | Erro na requisição do cliente |
| 🔒 401 Unauthorized | Token JWT ausente ou inválido |
| 🔍 404 Not Found | Recurso solicitado não encontrado |

---

# 🚀 Guia de Setup Local

Siga os passos abaixo para rodar o projeto localmente.

### 📌 Pré-requisitos
- Node.js (v18 ou superior)
- MySQL ou PostgreSQL rodando localmente

### 📥 Instalação
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/wendziin/api-loja-nodejs.git
cd projeto-api-loja
npm install
```

### ⚙️ Configuração do Banco de Dados
Crie um arquivo `.env` na raiz do projeto com as seguintes configurações. **Por padrão local, a API usa MySQL**:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=api_loja
JWT_SECRET=sua_chave_secreta
```

### 🗄 Criação do Banco e Dados Iniciais (Migrations e Seeds)
Para que a API funcione perfeitamente, precisamos criar as tabelas e popular o banco com alguns dados fictícios (produtos e categorias iniciais):

```bash
# 1. Crie o banco de dados (se ainda não existir)
npx sequelize-cli db:create

# 2. Rode as migrations para criar as tabelas
npm run migrate

# 3. Rode os seeders para popular o banco de dados
npm run seed
```

### ▶️ Iniciando o Servidor
Ambiente de desenvolvimento:
```bash
npm run dev
```
A API estará disponível em: `http://localhost:3000`

---

# ☁️ Deploy no Render (Produção)

Este projeto está preparado para rodar no **Render** utilizando **PostgreSQL** (banco gratuito oferecido pela plataforma). O arquivo de configuração `database.js` já identifica quando o ambiente é de produção e altera o dialeto para `postgres`.

### Configuração no Render:
1. Crie um banco de dados PostgreSQL no Render.
2. Crie um Web Service para a API conectada ao seu repositório.
3. Configure o **Build Command** para executar as migrations e seeds na compilação:
   ```bash
   npm install && npm run migrate && npm run seed
   ```
4. Configure o **Start Command**:
   ```bash
   npm start
   ```
5. Adicione as variáveis de ambiente em **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `(Sua Internal Database URL do PostgreSQL fornecida pelo Render)`
   - `JWT_SECRET`: `SuaChaveSecretaSegura`
   - `PORT`: `3000`

---

# 📖 Documentação Interativa (Swagger)
A API possui uma documentação visual e interativa gerada com Swagger, onde é possível visualizar detalhes dos endpoints e testar as rotas diretamente pelo navegador.

Após iniciar o servidor (seja local ou no Render), acesse:
- Local: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Produção: `https://seu-link-no-render.com/api-docs`
