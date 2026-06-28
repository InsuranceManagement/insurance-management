# Insurance Management Infra

Este repositorio contem a camada de infraestrutura e deploy do projeto
Insurance Management. A aplicacao e composta por dois componentes principais:
um frontend web e uma API backend.

## Aplicacoes Principais

| Aplicacao | Linguagem / stack | Responsabilidade | Publicacao |
|---|---|---|---|
| Frontend web | TypeScript, Next.js, React, Axios | Interface usada pelo usuario para autenticar, acessar dashboard e gerenciar seguradoras, produtos, tipos de produto e dados de negocio. Consome a API backend pelo gateway. | VM Linux com Docker |
| API backend | TypeScript, Node.js, NestJS, Prisma, PostgreSQL | API REST principal do sistema. Centraliza autenticacao, regras de negocio, acesso ao banco, dashboard e operacoes CRUD da aplicacao. | AKS |

O gateway e o ponto de entrada externo da aplicacao. Em producao, o frontend e
exposto na raiz e a API recebe o prefixo `/api`. Em homologacao, os recursos
recebem o prefixo `/homolog`.

## Rotas Principais

### Frontend web

Rotas principais da interface:

| Rota | Papel |
|---|---|
| `/` | Redireciona para o dashboard da aplicacao. |
| `/login` | Tela de autenticacao. |
| `/register` | Cadastro de usuario. |
| `/forgot-password` | Solicitacao de recuperacao de senha. |
| `/reset-password` | Redefinicao de senha. |
| `/dashboard` | Visao principal com indicadores do sistema. |
| `/seguradoras` | Gestao de seguradoras. |
| `/produtos` | Gestao de produtos. |
| `/tipos-de-produto` | Gestao dos tipos de produto. |

Publicacao pelo gateway:

```text
Producao:    https://apim-insurance-management.azure-api.net/
Homologacao: https://apim-insurance-management.azure-api.net/homolog
```

### API backend

A rota principal da API e a documentacao Swagger:

```text
/docs
```

No gateway, a documentacao fica disponivel em:

```text
Producao:    https://apim-insurance-management.azure-api.net/api/docs
Homologacao: https://apim-insurance-management.azure-api.net/homolog/api/docs
```

Grupos principais de rotas:

| Grupo | Rotas |
|---|---|
| Health/root | `GET /` |
| Documentacao | `GET /docs` |
| Usuarios e autenticacao | `POST /users`, `POST /users/login`, `POST /users/forgot-password`, `POST /users/reset-password`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users` |
| Seguradoras | `POST /insurance-companies`, `GET /insurance-companies`, `GET /insurance-companies/:id`, `PATCH /insurance-companies/:id`, `DELETE /insurance-companies` |
| Produtos | `POST /products`, `GET /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products` |
| Tipos de produto | `POST /product-types`, `GET /product-types`, `GET /product-types/:id`, `PATCH /product-types/:id`, `DELETE /product-types/:id` |
| Clientes | `POST /clients`, `GET /clients`, `GET /clients/:id`, `GET /clients/:id/products`, `PATCH /clients/:id`, `DELETE /clients` |
| Graficos | `POST /charts`, `GET /charts`, `GET /charts/:id`, `PATCH /charts/:id`, `DELETE /charts` |
| Tipos de grafico | `POST /chart-types`, `GET /chart-types`, `GET /chart-types/:id`, `PATCH /chart-types/:id`, `DELETE /chart-types` |
| Dashboard | `GET /dashboard/clients-by-insurance-company`, `GET /dashboard/kpi-total-clients` |

No gateway, as rotas da API recebem prefixo externo:

```text
Producao:    /api
Homologacao: /homolog/api
```

Exemplos:

```text
GET  /api/docs
POST /api/users/login
GET  /api/insurance-companies

GET  /homolog/api/docs
POST /homolog/api/users/login
GET  /homolog/api/insurance-companies
```
