# 🛒 Projeto API Loja

Este projeto é uma **API RESTful completa** desenvolvida como requisito de avaliação do curso **Fullstack**.  
Ele implementa um **CRUD completo de Usuários, Categorias e Produtos**, incluindo:

- 🔗 Relacionamentos complexos no banco de dados
- 🔐 Autenticação com **JWT**
- 🧪 Testes automatizados

---

# 📚 Escopo do Projeto

Para a implementação desta API foram utilizadas as seguintes tecnologias:

| Tecnologia | Descrição |
|-------------|-----------|
| 🟢 **Node.js** | Permite executar JavaScript no servidor |
| ⚡ **Express.js** | Framework para criação de rotas e APIs |
| 🔐 **JWT (JSON Web Token)** | Autenticação e proteção de rotas |
| ⚙️ **Dotenv** | Gerenciamento de variáveis de ambiente |
| 🔄 **Nodemon** | Reinicia o servidor automaticamente em desenvolvimento |
| 🗄 **MariaDB / MySQL** | Banco de dados relacional |
| 🧠 **Sequelize (ORM)** | Mapeamento objeto-relacional e migrations |
| 🧪 **Jest & Supertest** | Testes automatizados de integração |

---

# 📁 Estrutura de Diretórios

```text
project-root/
├── src/
│   ├── config/        # Configurações do projeto
│   ├── controllers/   # Lógica das rotas
│   ├── middleware/    # Middlewares (auth, validações etc.)
│   ├── models/        # Modelos do banco de dados
│   ├── routes/        # Definição das rotas
│   ├── app.js         # Configuração da aplicação
│   └── server.js      # Inicialização do servidor
│
├── tests/             # Testes automatizados
│
├── .env               # Variáveis de ambiente
├── .gitignore
└── package.json


---

📡 Status Code das Respostas

A API segue os padrões REST para códigos de resposta:

Código	Significado

✅ 200 OK	A requisição foi executada com sucesso
🆕 201 Created	Um novo recurso foi criado
📭 204 No Content	Requisição executada sem retorno de conteúdo
⚠️ 400 Bad Request	Erro na requisição do cliente
🔒 401 Unauthorized	Token JWT ausente ou inválido
🔍 404 Not Found	Recurso solicitado não encontrado



---

🚀 Guia de Setup e Execução

Siga os passos abaixo para rodar o projeto localmente.


---

📌 Pré-requisitos

Antes de começar, você precisa ter instalado:

🟢 Node.js (v18 ou superior)

🗄 MySQL ou MariaDB



---

📥 Instalação

Clone o repositório e instale as dependências:

git clone <url-do-seu-repositorio>
cd projeto-api-loja
npm install


---

⚙️ Configuração do Banco de Dados

Crie um arquivo .env na raiz do projeto com as seguintes configurações:

PORT=3000

DB_HOST=127.0.0.1
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=api_loja

JWT_SECRET=chave_secreta_jwt_aqui


---

🗄 Criação do Banco e Tabelas (Migrations)

Execute os comandos abaixo para criar o banco e aplicar as migrations:

npx sequelize-cli db:create
npx sequelize-cli db:migrate

Esses comandos irão criar as tabelas:

Users

Categories

Products

ProductImages

ProductOptions

ProductCategories



---

▶️ Iniciando o Servidor

Ambiente de desenvolvimento (com Nodemon)

npm run dev

O servidor estará disponível em:

http://localhost:3000


---

🧪 Executando os Testes

O projeto possui testes de integração utilizando:

Jest

Supertest


Para executar os testes:

npm test

Certifique-se de que o banco de dados esteja criado e configurado antes de rodar os testes.

### 📖 Documentação Interativa (Swagger)
A API possui uma documentação visual e interativa gerada com Swagger, onde é possível visualizar detalhes dos endpoints e testar as rotas diretamente pelo navegador.
Após iniciar o servidor localmente, acesse:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)
