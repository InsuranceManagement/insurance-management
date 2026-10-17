# Plano de correção de segurança

**Data da revisão:** 2026-09-27

**Status:** fases 1, 2 e 3 parcialmente concluídas; fase 4 implementada no código, pendente de testes de regressão; fase 5 pendente. A avaliação atual é **5/10 para deploy público**. Ainda há bloqueadores antes da publicação.

**Contexto:** aplicação para um único corretor, com deploy inicial previsto em uma VPS.

## Objetivo e escopo

Levar os achados de segurança identificados na revisão para mudanças concretas, ordenadas por prioridade e verificáveis antes da entrada em produção. O plano cobre backend, frontend, banco e dependências. A pasta `infra/` permanece fora do escopo da revisão do repositório; controles operacionais da VPS devem ser verificados durante a preparação do deploy.

## Fase 1 — Fechar o cadastro público e corrigir autorização

**Prioridade: crítica. Estado: parcialmente concluída.** O cadastro público e as operações de usuário foram corrigidos, mas o seed ainda inclui uma conta com hash de senha estático versionado. Se o seed for executado, seu `upsert` pode criar essa conta ou restaurar seus dados, inclusive a senha.

1. **Feito — Detectado:** não há mais `POST /users` público nem página de cadastro no frontend.
2. **Feito — Detectado:** `GET /users/:id` e `PATCH /users/:id` exigem que o identificador seja o do usuário autenticado; a troca de e-mail ou senha exige a senha atual. Não há listagem ou exclusão pública de usuários.
3. **Feito — Detectado:** existe `npm run user:bootstrap`, que exige credenciais fornecidas pelo ambiente e recusa criar a conta inicial quando já existe usuário ativo.
4. **Pendente — bloqueador:** retirar `user` de `backend/prisma/seed-data.ts` e impedir que `backend/prisma/seed.ts` recrie ou sobrescreva contas. Manter dados de demonstração sem credenciais. Garantir que o seed não faça parte do provisionamento da conta real.
5. **Pendente:** confirmar que nenhuma conta criada pelo seed antigo será levada para produção. Se esse seed já foi executado no banco de destino, remover ou substituir a conta por uma criada com o bootstrap controlado e rotacionar sua senha antes de expor a aplicação.
6. **Mantido — Detectado:** a proteção CSRF segue aplicada às operações que modificam dados.

**Critérios de aceite:** cadastro anônimo não cria usuário; interface não mostra cadastro público; usuário não consegue consultar ou alterar outra conta; alterações de senha e e-mail exigem a senha atual; o seed não contém nem cria contas e não restaura senha; a conta inicial pode ser criada sem segredo fixo no código.

**Áreas envolvidas:** `backend/prisma/seed-data.ts`, `backend/prisma/seed.ts`, `backend/scripts/bootstrap-user.ts`, `backend/src/modules/user/user.controller.ts` e fluxo de login no frontend.

## Fase 2 — Tornar as sessões revogáveis

**Prioridade: alta. Estado: parcialmente concluída.** A tabela de sessões e a validação de revogação foram implementadas. Resta corrigir o tratamento de falha no logout: atualmente a API limpa o cookie e retorna sucesso mesmo quando não consegue persistir a revogação. Nesse caso, uma cópia do cookie continua válida.

O requisito de manter outros dispositivos conectados no logout foi atendido com uma tabela de sessões. Uma versão global no usuário invalidaria todos os dispositivos em cada logout.

1. **Feito — Detectado:** `Session` armazena identificador, usuário, expiração, revogação e criação, com índices para consulta e limpeza. O JWT contém `sid` e `tokenType`; o guard verifica o JWT e a sessão ativa no banco em cada requisição protegida.
2. **Feito — Detectado:** a troca e a redefinição de senha revogam as sessões ativas. O logout revoga apenas a sessão atual quando a operação no banco tem sucesso. A sessão expira junto com o JWT e o token completo não é armazenado na tabela.
3. **Feito — Detectado:** uma rotina NestJS executa semanalmente, no fuso `America/Sao_Paulo`, a exclusão em lote de sessões expiradas ou revogadas. A limpeza não participa da decisão de autenticação e sua falha é registrada sem interromper a API.
4. **Pendente — bloqueador:** no logout, limpar o cookie e responder `204` somente após a revogação no banco ter sucesso. Se a gravação falhar, manter o cookie para permitir nova tentativa, retornar erro HTTP de indisponibilidade ou equivalente e não registrar token nem dados pessoais.
5. **Pendente — bloqueador:** no frontend, não apagar o estado local nem apresentar logout concluído quando a API retornar erro; informar que a saída não foi confirmada e permitir tentar novamente.
6. **Pendente:** adicionar teste que simule falha do banco na revogação e comprove que a resposta não indica sucesso e o cliente pode tentar novamente. Cobrir também que o logout válido revoga somente o dispositivo atual e mantém as outras sessões.
7. **Mantido para evolução:** com múltiplas instâncias da API, garantir que execuções concorrentes da limpeza permaneçam idempotentes ou designar uma instância responsável.

**Critérios de aceite:** logout bem-sucedido invalida imediatamente apenas a sessão atual; falha de revogação retorna erro, preserva o cookie e permite nova tentativa; outras sessões do mesmo usuário continuam funcionando; troca/reset de senha invalidam todas as sessões; sessão inexistente, revogada, expirada ou pertencente a outro usuário recebe `401`; JWT sem tipo, `sid` ou `sub` válido é rejeitado; a rotina remove registros expirados e revogados, preserva os ativos e pode ser executada novamente sem alterar o resultado de autenticação. Se houver desativação de conta no futuro, ela deve revogar todas as sessões.

**Impacto da publicação da migração de sessões:** tokens emitidos antes dela não passam na validação atual; o corretor precisa entrar novamente em cada dispositivo após a migração.

**Áreas envolvidas:** `backend/src/modules/user/user.controller.ts`, `backend/src/modules/session/session.repository.ts`, `frontend/src/shared/context/auth-context.tsx` e testes de autenticação. A migração, o módulo de sessões e a rotina agendada já existem.

## Fase 3 — Separar tokens de usuário e de integração

**Prioridade: alta. Estado: parcialmente concluída.** O token de integração continua sendo assinado com `JWT_SECRET`, compartilhado com os tokens de usuário. O guard atual exige `sub`, `sid`, `tokenType: 'access'` e sessão ativa; por isso, o token de integração atual não autentica chamadas de usuário. Ainda faltam segredos separados e a validação de emissor/audiência. A separação depende também do contrato do microserviço externo de notificações.

1. **Feito — Detectado:** tokens de usuário exigem `sub`, `sid`, `tokenType: 'access'` e sessão ativa no banco. O token de integração atual não atende a esse contrato.
2. **Pendente:** alinhar com o microserviço de notificações a aceitação de uma chave exclusiva de integração. Configurar `NOTIFICATIONS_JWT_SECRET` no emissor e no verificador, sem reutilizar `JWT_SECRET`.
3. **Pendente:** definir e validar `iss`, `aud` e tipo de token em ambos os lados da integração; rejeitar token de usuário como credencial do serviço e vice-versa.
4. **Pendente:** exigir segredos presentes, suficientemente fortes e distintos no startup de produção. Planejar rotação coordenada, pois tokens antigos deixarão de funcionar.

**Critérios de aceite:** token de serviço não autentica chamadas de usuário; token de usuário não é aceito como credencial da integração; tokens com emissor, audiência ou finalidade incorretos são rejeitados; API e integração não iniciam em produção com segredos ausentes ou iguais.

**Áreas envolvidas:** configuração de ambiente, módulos de autenticação/notificações, `auth.service.ts` e `notifications-ms.client.ts`.

## Fase 4 — Evitar enumeração de contas na recuperação de senha

**Prioridade: média. Estado: implementada no código, pendente de validação automatizada.** O fluxo atual retorna a mesma resposta neutra para e-mail inexistente, cooldown e falha de envio. O cooldown é registrado antes do envio. Não foi verificada equivalência de tempo de resposta entre esses casos.

1. **Feito — Detectado:** a resposta HTTP de `forgot-password` é neutra para e-mail inexistente, cooldown e falha de envio; dentro do cooldown não é gerado outro token.
2. **Feito — Detectado:** há limite por IP e o cooldown é registrado atomicamente antes do envio. O cliente de notificações não registra corpos completos da resposta externa nesse fluxo.
3. **Pendente:** adicionar testes de regressão para resposta, cooldown e falha da integração, inclusive verificando que uma falha de envio não libera tentativas ilimitadas.
4. **Evolução posterior:** avaliar fila ou outbox se diferenças de tempo observáveis ou disponibilidade do serviço de e-mail se tornarem relevantes.

**Critérios de aceite:** solicitações para e-mail existente ou inexistente têm o mesmo status e corpo; cooldown não revela cadastro; indisponibilidade do serviço externo não revela se a conta existe e não permite disparos ilimitados. Diferenças de tempo devem ser avaliadas separadamente.

**Áreas envolvidas:** `backend/src/modules/user/services/user.service.ts`, `passwordReset.service.ts` e logs do cliente de notificações.

## Fase 5 — Atualizar dependências e reduzir exposição

**Prioridade: crítica antes da produção. Estado: pendente.** Em 2026-09-27, `npm audit --omit=dev` apontou no frontend 38 alertas (1 crítico, 22 altos, 6 moderados e 9 baixos) e no backend 23 (16 altos, 6 moderados e 1 baixo). O frontend fixa Next.js em `16.2.6`, versão incluída no alerta crítico [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), cujo cenário específico exige processamento de AVIF. A auditoria também aponta Axios `1.16.0` e dependências transitivas. Os totais incluem ferramentas declaradas em `dependencies` e não demonstram que todos os alertas sejam exploráveis nesta aplicação.

1. **Pendente — bloqueador:** atualizar Next.js e `eslint-config-next` em conjunto para uma versão corrigida e compatível, ao menos `16.3.3` para o alerta citado; preferir a versão estável corrigida mais recente disponível no momento da implementação. Confirmar o comportamento de `next/image` e da otimização de imagens após a atualização.
2. **Pendente:** atualizar Axios para uma versão fora dos intervalos vulneráveis apontados pela auditoria. Atualizar pacotes NestJS afetados e dependências transitivas do backend, mantendo compatibilidade com Prisma e o restante da aplicação.
3. **Pendente:** atualizar os dois lockfiles e conferir a instalação limpa a partir deles.
4. **Pendente:** executar novamente `npm audit --omit=dev` em backend e frontend; classificar cada alerta residual por pacote, severidade, caminho de dependência, uso real e pré-condições de exploração. Não tratar a contagem agregada como prova de exploração.
5. **Pendente:** mover ferramentas de desenvolvimento para `devDependencies` quando não forem necessárias em runtime; avaliar em especial `shadcn` no frontend e o Prisma CLI no backend.
6. **Pendente:** restringir Swagger em produção ou protegê-lo por autenticação. Evitar que o guard libere `/docs` incondicionalmente nesse ambiente.
7. **Pendente:** validar variáveis de ambiente obrigatórias no startup. Em produção, falhar explicitamente se `JWT_SECRET`, `CSRF_SECRET` ou `DATABASE_URL` estiverem ausentes ou inválidos; validar também URLs, origens permitidas e configuração necessária para recuperação de senha.
8. **Pendente:** revisar logs da integração e remover qualquer corpo externo que possa expor dados pessoais ou informações internas.
9. **Evolução posterior:** revisar a CSP e planejar a remoção de `unsafe-inline` quando compatível com a aplicação.

**Critérios de aceite:** Next.js e Axios estão em versões corrigidas; lockfiles refletem as versões adotadas; builds e lint passam; não há alerta crítico aplicável ao runtime de produção; alertas remanescentes estão identificados e justificados; configuração de produção não inicia com segredos essenciais ausentes; Swagger não é público em produção.

## Validação de segurança

Cobrir os seguintes fluxos com testes automatizados backend e validação ponta a ponta quando o banco estiver disponível:

- cadastro público bloqueado;
- seed não cria nem atualiza usuários, e bootstrap só cria a conta inicial quando não existe usuário ativo;
- tentativa de consultar ou alterar outro usuário negada;
- mudança de e-mail e senha exige reautenticação;
- token ausente, inválido, expirado ou destinado à integração rejeitado;
- logout revoga apenas a sessão atual quando tem sucesso; falha de persistência retorna erro, preserva o cookie e o estado de autenticação do frontend para permitir nova tentativa;
- troca e redefinição de senha revogam todas as sessões;
- a limpeza agendada remove sessões expiradas/revogadas, preserva sessões ativas e tolera execução repetida;
- usuário excluído não acessa endpoints protegidos;
- recuperação de senha não revela se o e-mail existe;
- mutações sem CSRF são rejeitadas;
- origem fora da lista configurada é bloqueada por CORS;
- configuração de produção inválida impede o startup; Swagger não fica público em produção;
- após atualizar dependências, confirmar builds, lint e auditoria dos lockfiles.

Antes de finalizar a implementação, revisar a falha já observada no teste de idempotência de notificações; ela é independente dos achados acima, mas impede que a suíte atual passe integralmente.

Comandos do projeto, quando aplicáveis:

```text
backend: npm run prisma:generate
backend: npm run format:check
backend: npm run lint
backend: npm run build
backend: npm run test
backend: npm run test:e2e
frontend: npm run lint
frontend: npm run build
```

Os testes e2e dependem de banco e variáveis de ambiente configurados. Não incluir segredos, tokens, hashes ou dados de clientes em documentação ou logs.

## Sequência de publicação

1. Remover a conta fixa do seed e confirmar que nenhum banco destinado à produção contém uma conta criada pelo seed antigo. Não executar o seed antigo na VPS.
2. Corrigir o logout para que falha de revogação não seja apresentada como sucesso; validar com teste de falha de banco.
3. Atualizar Next.js e demais dependências afetadas, atualizar os lockfiles e revisar a auditoria residual.
4. Confirmar backup restaurável do banco e preparar a migração da tabela de sessões, se ainda não tiver sido aplicada no banco de destino.
5. Configurar segredos distintos, fortes e obrigatórios, URLs válidas e origens permitidas; coordenar a mudança de segredo da integração com o microserviço externo.
6. Publicar backend com cadastro fechado, autorização revisada, validação de sessão e Swagger restrito; publicar frontend sem cadastro público e com dependências corrigidas.
7. Provisionar a conta única do corretor pelo bootstrap controlado, sem deixar as variáveis `BOOTSTRAP_USER_*` no ambiente após o uso.
8. Validar login, logout, reset de senha, revogação em múltiplos dispositivos e o caso de falha de revogação.
9. Verificar o ambiente da VPS — TLS/HTTPS, portas expostas, acesso externo ao PostgreSQL, firewall, usuário do processo e restauração do backup. Essa verificação operacional fica fora da análise da pasta `infra/`.
10. Acompanhar tentativas de login/recuperação e respostas `401`/`403` após a entrada em produção.

## Ordem recomendada

O cadastro público, a autorização entre contas, a tabela de sessões e a resposta neutra de recuperação já foram corrigidos no código. Os bloqueadores atuais são: conta fixa no seed, logout que oculta falha de revogação e Next.js afetado por alerta crítico. Depois, separar os segredos da integração em coordenação com o serviço externo e validar configuração e exposição do Swagger antes do deploy. Os controles operacionais da VPS precisam de verificação própria.
