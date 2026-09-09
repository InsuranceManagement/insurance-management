# Funcionalidades detectadas

| Area | Backend | Frontend | Evidencia principal |
| --- | --- | --- | --- |
| Autenticacao | Registro, login, JWT, forgot/reset password | Telas e hooks para os quatro fluxos | `backend/src/modules/user`, `frontend/src/features/Auth` |
| Usuarios | Listar, obter, atualizar e excluir em lote | Sem tela de administracao detectada | `backend/src/modules/user/user.controller.ts` |
| Seguradoras | CRUD e soft delete em lote | CRUD tabular protegido | `backend/src/modules/insurance-company`, `frontend/src/features/InsuranceCompanyCrud` |
| Tipos de produto | CRUD, ID derivado do nome, soft delete | CRUD tabular protegido | `backend/src/modules/product-type`, `frontend/src/features/ProductTypeCrud` |
| Produtos | CRUD e relacoes com tipo/seguradora | CRUD tabular com selects | `backend/src/modules/product`, `frontend/src/features/ProductCrud` |
| Clientes | CRUD, endereco, produtos associados, CPF/CNPJ | CRUD tabular e formulario composto | `backend/src/modules/client`, `frontend/src/features/ClientCrud` |
| Visitas | CRUD, filtro por data e validacao do cliente | Calendario mensal/semanal/diario | `backend/src/modules/visit`, `frontend/src/features/Visits` |
| Dashboard | 4 KPIs, 4 distribuicoes/series e 1 heatmap | Widgets dinamicos por configuracao | `backend/src/modules/dashboard`, `frontend/src/features/Dashboard` |
| Charts | CRUD de configuracoes | Consome apenas listagem para montar dashboard | `backend/src/modules/chart`, `frontend/src/features/Dashboard/hooks/use-dashboard.ts` |
| Chart types | CRUD com presets de tamanho | Sem gestao detectada | `backend/src/modules/chart-type` |
| Notificacoes | Logs e criacao/edicao de templates via servico externo | Sem tela detectada | `backend/src/modules/notifications` |

## Regras funcionais relevantes

- Auth: registro retorna sessao, mas o frontend redireciona cadastro para login; login leva ao dashboard.
- Usuario/cliente nao podem repetir e-mail ativo. Cliente exige pelo menos CPF ou CNPJ e pode associar zero ou mais produtos ativos.
- Seguradora e tipo de produto rejeitam nome ativo duplicado.
- Tipo de produto cria ID com nome em maiusulas e espacos convertidos para underscore.
- Chart e chart type usam o proprio nome como ID; mudanca de nome pode mudar a chave primaria.
- Visits so aceita `clientId` de cliente ativo; listagem aceita limites inclusivos `startDate` e `endDate`.
- O dashboard considera somente registros nao excluidos nos agregados que possuem soft delete.
- Forgot-password nao revela se o e-mail existe e limita repeticao por usuario.

## Cobertura de interface

- Protegidas: `/dashboard`, `/seguradoras`, `/tipos-de-produto`, `/produtos`, `/clientes`, `/visitas`.
- Publicas: `/login`, `/register`, `/forgot-password`, `/reset-password`.
- **Detectado:** nao ha paginas para usuarios, charts, chart types ou notificacoes.
- **Desconhecido:** se essas paginas ausentes sao planejadas.
