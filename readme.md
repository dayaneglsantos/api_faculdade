# Api Faculdade

Api desenvolvida para a disciplina de Contrução Backend do curso de Análise e Desenvolvimento de Sistemas

## 📂 Estrutura de pastas

- **Config** - Possui arquivos de configurações
- **Controllers** - Possui os controladores com funções usadas nas rotas
- **Middlewares** - Possui arquivos com middlewares
- **Models** - Arquivos com as querys (comunicação com banco de dados)
- **Routes** - Arquivos com as rotas da API
- **Tests** - Possui arquivos de testes da aplicação

### 🔧 Instalação

Passo a passo para execução do projeto:

Instalação das dependências

```
npm install
```

Rodando o projeto

```
npm run dev
```

Rodando testes

```
npm run test
```

Rodando testes com cobertura

```
npm run coverage
```

## 🛠️ Tecnologias

Ferramentas utilizadas no projeto:

- [Express](https://expressjs.com/) - Framework NodeJs para contrução de API
- [Vitest](https://vitest.dev/guide/) - Framework de testes
- [Swagger](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) - Documentação da API
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Usada para criptografar (hash) as senhas
- [cors](https://www.npmjs.com/package/cors) - Middleware para proteção da API (acesso de dominios diferentes)
- [dotenv](https://www.npmjs.com/package/dotenv) - Patote para gerenciamento das variáveis de ambiente
- [Json Web Token](https://www.npmjs.com/package/jsonwebtoken) - Para autenticação
- [Mysql2](https://www.npmjs.com/package/mysql2) - Client Mysql para NodeJs
- [yamljs](https://www.npmjs.com/package/yamljs) - Para leitura de arquivos YML
- [Nodemon](https://www.npmjs.com/package/nodemon) - Usado para otimizar o desenvolvimento
- [Supertest](https://www.npmjs.com/package/supertest) - Usado para simular requisições HTTP (nos testes)

## Informações

- Todas as rotas são privadas com excessão da rota de autenticação
- Acesso a documentação rodando projeto localmente: _localhost:port/api-docs/_

##### Recomendações para teste da api:

- Configurar DB
- Rodar projeto
- Criar usuário pelo Postman
- Testar documentação pelo Swagger (com o usuário criado autenticado)

### 🚀 Desenvolvido por:

👩🏻‍💻 Dayane Gabrielly L. dos Santos
