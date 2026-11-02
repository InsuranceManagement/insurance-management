# Funcionalidades detectadas

| Area | Backend | Frontend | Evidencia principal |
| --- | --- | --- | --- |
| Autenticacao | Login com sessao revogavel, JWT, forgot/reset password; conta inicial via procedimento administrativo | Telas e hooks para login e recuperacao | `backend/src/modules/user`, `backend/src/modules/session`, `frontend/src/features/Auth` |
| Usuarios | Obter e atualizar a propria conta | Sem tela de administracao detectada | `backend/src/modules/user/user.controller.ts` |
| Seguradoras | CRUD e soft delete em lote | CRUD tabular protegido | `backend/src/modules/insurance-company`, `frontend/src/features/InsuranceCompanyCrud` |
| Tipos de produto | CRUD, ID derivado do nome, soft delete | CRUD tabular protegido | `backend/src/modules/product-type`, `frontend/src/features/ProductTypeCrud` |
| Produtos | CRUD e relacoes com tipo/seguradora | CRUD tabular com selects | `backend/src/modules/product`, `frontend/src/features/ProductCrud` |
| Clientes | CRUD, endereco, produtos associados, CPF/CNPJ | CRUD tabular e formulario composto | `backend/src/modules/client`, `frontend/src/features/ClientCrud` |
| Leads | Cadastro, listagem, exclusao logica e conversao transacional em cliente | Visualizacao com acao de conversao e formulario de cliente preenchido com nome/telefone | `backend/src/modules/lead`, `backend/src/modules/client/client.repository.ts`, `frontend/src/features/LeadCrud` |
| Visitas | CRUD, filtro por data e validacao do cliente | Calendario mensal/semanal/diario | `backend/src/modules/visit`, `frontend/src/features/Visits` |
| Dashboard | 4 KPIs, 4 distribuicoes/series e 1 heatmap; filtro global opcional por intervalo inclusivo de cadastro | Widgets dinamicos por configuracao; o intervalo deve conter data inicial e final e sem filtro mostra todo o historico | `backend/src/modules/dashboard`, `frontend/src/features/Dashboard` |
| Charts | CRUD de configuracoes | Consome apenas listagem para montar dashboard | `backend/src/modules/chart`, `frontend/src/features/Dashboard/hooks/use-dashboard.ts` |
| Chart types | CRUD com presets de tamanho | Sem gestao detectada | `backend/src/modules/chart-type` |
| Notificacoes | Logs e criacao/edicao de templates via servico externo | **Detectado:** historico de mensagens em `/logs`, com busca, filtros por status/tipo/erro, paginacao local e detalhes | `backend/src/modules/notifications`, `frontend/src/features/ApplicationLogs` |

## Regras de notificacao agendadas

**Detectado:** `NotificationRuleScheduler` chama `executeDailyRules()` todos os dias as 09:00 no fuso `America/Sao_Paulo` (`backend/src/modules/notification-rule/notification-rule.scheduler.ts`). O modulo registra o scheduler no `NotificationRuleModule`; o processamento roda dentro do processo NestJS.

**Detectado:** em cada execucao, o servico carrega regras ativas em ordem de criacao e clientes ativos (`deletedAt: null`). Para cada par regra/cliente, avalia as condicoes e envia uma mensagem usando o `templateId` da regra somente quando todas as condicoes combinadas forem satisfeitas. As regras nao guardam destinatarios: cada execucao reavalia os clientes atuais.

**Detectado:** condicoes podem conter `all` (todas precisam corresponder) e/ou `any` (ao menos uma precisa corresponder, quando o grupo nao esta vazio). Os campos aceitos sao `context.today`, `client.birthDate` e `client.createdAt`; o unico operador e `EQUALS`. Com `isRecurring: true`, a comparacao usa mes e dia (`MM-DD`), ignorando o ano; com `false`, compara a data completa (`YYYY-MM-DD`). Datas de calendario sao calculadas no fuso `America/Sao_Paulo`. `context.today` como valor e reservado para comparar um campo do cliente com a data de hoje; nao e aceito como valor de uma condicao cujo campo tambem seja `context.today`.

**Detectado:** o envio passa por `NotificationsMsClient.sendTemplateEmail()` para `POST /notifications/send`, com tipo `ResendEmail`, `resendApiKey`, e-mail do cliente, ID do template e variaveis `client.id`, `client.name`, `client.email`, `client.phoneNumber`, `client.birthDate` e `context.today`. O cliente externo tem timeout de sete segundos. Falha ao enviar para um cliente e registrada e nao impede o processamento dos pares seguintes. Evidencias: `backend/src/modules/notification-rule/notification-rule.service.ts`, `backend/src/modules/notifications/notifications-ms.client.ts`.

**Detectado:** a pre-visualizacao `POST /notification-rules/:id/preview` aplica a mesma avaliacao e retorna o total e ate 20 clientes correspondentes; ela nao envia mensagens. O teste esta disponivel na tela de regras.

**Detectado:** o payload `ResendEmail` do envio por regra atualmente nao inclui `resendFrom`, embora esse campo apareca no contrato informado para o servico externo. Verifique essa integracao antes de esperar que os envios agendados sejam aceitos.

**Inferencia:** nao ha lock distribuido nem registro local de execucao/idempotencia no scheduler. Se varias replicas do backend estiverem rodando, cada replica pode executar o job e tentar enviar as mesmas mensagens. Tambem, como as regras sao reavaliadas diariamente sem registro de envio, uma condicao que continuar verdadeira pode enviar novamente a cada dia.

Evidencias principais: `backend/src/modules/notification-rule/notification-rule.scheduler.ts`, `backend/src/modules/notification-rule/notification-rule.service.ts`, `backend/src/modules/notification-rule/notification-rule.processor.ts`, `backend/src/modules/notification-rule/notification-rule.repository.ts`, `backend/src/modules/notifications/notifications-ms.client.ts`.

## Regras funcionais relevantes

- Auth: nao ha cadastro publico; a conta inicial e criada pelo comando administrativo de bootstrap; login cria sessao revogavel e leva ao dashboard.
- Usuario/cliente nao podem repetir e-mail ativo. Cliente exige pelo menos CPF ou CNPJ e pode associar zero ou mais produtos ativos.
- Seguradora e tipo de produto rejeitam nome ativo duplicado.
- Seguradoras e tipos de produto com produtos ativos associados nao podem ser excluidos; produtos so aceitam associacoes com pais ativos.
- Tipo de produto cria ID com nome em maiusulas e espacos convertidos para underscore.
- Chart e chart type usam o proprio nome como ID; mudanca de nome pode mudar a chave primaria.
- Visits so aceita `clientId` de cliente ativo; listagem aceita limites inclusivos `startDate` e `endDate`.
- O dashboard considera somente registros nao excluidos nos agregados que possuem soft delete.
- Forgot-password nao revela se o e-mail existe e limita repeticao por usuario.

## Cobertura de interface

- Protegidas: `/dashboard`, `/seguradoras`, `/tipos-de-produto`, `/produtos`, `/clientes`, `/visitas`, `/logs`.
- Publicas: `/login`, `/forgot-password`, `/reset-password`.
- **Detectado:** nao ha paginas para usuarios, charts ou chart types.
- **Detectado:** `/logs` consulta `GET /notifications/logs`, mostra tipo, destinatario, remetente e status amigavel, e nao renderiza o HTML do corpo da mensagem. O contrato atual nao fornece nome de template no log. Status e tipos usam os nomes retornados pela API, com traducao dos valores tecnicos conhecidos e fallback para os IDs quando as relacoes sao nulas. Evidencias: `frontend/src/features/ApplicationLogs`, `frontend/src/app/(protected)/logs/page.tsx`.
- **Desconhecido:** se essas paginas ausentes sao planejadas.
