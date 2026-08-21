# API Faculdade

API desenvolvida para a disciplina de Construção Backend do curso de Análise e Desenvolvimento de Sistemas.

O projeto permite gerenciar usuários, cursos e matrículas. A autenticação é feita com JWT e as senhas são protegidas com bcrypt.

## Funcionalidades

- Login com e-mail e senha
- Perfis de administrador e estudante
- Cadastro e gerenciamento de usuários
- Consulta, edição e exclusão da própria conta
- Cadastro e gerenciamento de cursos
- Matrícula de estudantes em mais de um curso
- Bloqueio da exclusão de cursos com alunos matriculados
- Documentação com Swagger
- Testes automatizados

## Perfis de usuário

### Administrador

O administrador pode:

- Cadastrar e consultar usuários
- Atualizar e excluir usuários
- Criar, atualizar e excluir cursos
- Matricular e remover estudantes dos cursos

### Estudante

O estudante pode:

- Consultar e atualizar a própria conta
- Excluir a própria conta confirmando a senha
- Consultar os cursos em que está matriculado
- Consultar os cursos disponíveis

## Tecnologias

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Swagger
- Vitest
- Supertest

## Estrutura de pastas

```text
database/migrations  Scripts de criação das tabelas
scripts              Scripts auxiliares
src/config           Configurações da aplicação
src/controllers      Regras das requisições
src/middlewares      Autenticação, autorização e erros
src/models           Consultas ao banco de dados
src/routes           Rotas da API
src/services         Serviços de autenticação e senha
tests                Testes automatizados
```

## Configuração do projeto

### 1. Instale as dependências

```powershell
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e informe os dados do seu ambiente.

```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=api-faculdade
FRONTEND_DEV_URL=http://localhost:5173
FRONTEND_PROD_URL=url_do_frontend
JWT_SECRET=sua_chave_secreta
```

### 3. Crie o banco de dados

Crie um banco com o mesmo nome informado em `DB_NAME`.

```sql
CREATE DATABASE `api-faculdade`;
```

Depois, execute os arquivos abaixo na ordem:

```text
database/migrations/001_create_users.sql
database/migrations/002_create_courses.sql
database/migrations/003_create_user_courses.sql
```

### 4. Crie o primeiro administrador

```powershell
npm run create-admin
```

Esse script funciona somente quando ainda não existe um administrador. Os próximos usuários devem ser cadastrados pelo fluxo normal da API.

### 5. Inicie a aplicação

```powershell
npm run dev
```

## Documentação

Com a aplicação em execução, acesse:

```text
http://localhost:3000/api-docs
```

Faça login, copie o token retornado e use o botão **Authorize** do Swagger para testar as rotas protegidas.

## Principais rotas

### Autenticação

```text
POST /login
```

### Usuários

```text
GET    /users
POST   /users
GET    /users/me
PATCH  /users/me
DELETE /users/me
GET    /users/:id
PUT    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

### Cursos

```text
GET    /courses
POST   /courses
GET    /courses/:id
PATCH  /courses/:id
DELETE /courses/:id
```

### Matrículas

```text
GET    /users/me/courses
GET    /users/:userId/courses
POST   /users/:userId/courses/:courseId
DELETE /users/:userId/courses/:courseId
```

## Testes

Executar todos os testes uma vez:

```powershell
npm test
```

Executar os testes enquanto os arquivos são alterados:

```powershell
npm run test:watch
```

Gerar o relatório de cobertura:

```powershell
npm run coverage
```

Os testes usam mocks e não alteram os dados do banco configurado.

## Autora

Desenvolvido por Dayane Gabrielly L. dos Santos.
