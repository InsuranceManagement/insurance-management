# Plano de correção de segurança

**Data:** 2026-09-26  
**Status:** plano proposto; as correções abaixo ainda precisam ser implementadas.  
**Contexto:** aplicação para um único corretor, com deploy inicial previsto em uma VPS.

## Objetivo e escopo

Levar os achados de segurança identificados na revisão para mudanças concretas, ordenadas por prioridade e verificáveis antes da entrada em produção. O plano cobre backend, frontend, banco e dependências. A pasta `infra/` permanece fora do escopo da revisão do repositório; controles operacionais da VPS devem ser verificados durante a preparação do deploy.

## Fase 1 — Fechar o cadastro público e corrigir autorização

**Prioridade: crítica.** Hoje o cadastro público cria uma conta autenticada com acesso equivalente ao corretor. Operações de usuário também não restringem o acesso ao titular da conta.

1. Remover `@Public()` de `POST /users` ou desativar essa rota em produção.
2. Retirar a página `/register` e o link de cadastro do frontend. Essa medida complementa a restrição do backend, sem substituí-la.
3. Provisionar a conta do corretor por um procedimento administrativo controlado, sem credencial fixa ou senha em texto simples no repositório.
4. Autorizar `GET /users/:id` e `PATCH /users/:id` somente para o próprio usuário. Remover a listagem geral de usuários se não houver requisito de produto.
5. Remover a exclusão em lote de usuários ou impedir a exclusão de outras contas. Para esse cenário, uma única conta não precisa de gestão pública de usuários.
6. Exigir reautenticação com a senha atual para trocar senha ou e-mail.
7. Preservar CSRF em todas as operações que modificam dados.

**Critérios de aceite:** cadastro anônimo não cria usuário; interface não mostra cadastro público; usuário não consegue consultar, alterar ou excluir outra conta; alterações de senha e e-mail exigem a senha atual; a conta inicial pode ser criada sem segredo fixo no código.

**Áreas envolvidas:** `backend/src/modules/user/user.controller.ts`, `backend/src/modules/user/services/user.service.ts`, DTOs de usuário e telas de registro/login no frontend.

## Fase 2 — Tornar as sessões revogáveis

**Prioridade: alta.** Apagar o cookie do navegador no logout não invalida uma cópia do JWT. O token atual permanece válido até expirar, mesmo após logout, troca de senha ou desativação da conta.

Como o corretor precisa manter outros dispositivos conectados quando encerra uma sessão, usar uma tabela de sessões. Uma versão global no usuário invalidaria todos os dispositivos em cada logout e não atende a esse requisito.

1. Criar um modelo `Session` relacionado a `User`, com identificador, `userId`, `expiresAt`, `revokedAt` e `createdAt`; adicionar índices que apoiem a busca por sessão/usuário e a limpeza por expiração e revogação.
2. Em cada login, criar uma sessão e incluir seu identificador (`sid`) e um tipo explícito no JWT. Cada dispositivo e perfil de navegador terá sua própria sessão.
3. Em cada requisição autenticada, validar assinatura, expiração e finalidade do JWT; buscar a sessão por `sid` e confirmar que pertence ao usuário, não foi revogada, ainda não expirou e que o usuário continua ativo.
4. No logout, revogar somente a sessão indicada pelo JWT atual, condicionando a alteração ao `sid` e ao `userId` autenticados. Limpar o cookie mesmo se a operação de revogação falhar.
5. Na troca ou redefinição de senha e na desativação da conta, revogar todas as sessões ativas do usuário.
6. Manter o tempo de vida da sessão alinhado ao `exp` do JWT. A verificação do estado da sessão em cada requisição continua obrigatória; a rotina de limpeza é apenas manutenção e não participa da decisão de autenticação.
7. Não armazenar o JWT completo na tabela. O identificador da sessão não deve, sozinho, servir como credencial.
8. Registrar no módulo de sessões uma rotina de limpeza agendada pelo NestJS, usando o `ScheduleModule` já registrado no `AppModule`. Executá-la diariamente em um fuso horário explícito, adequado à operação da aplicação.
9. A rotina deve apagar em lote somente sessões expiradas ou já revogadas, ser segura para execução repetida e manter registros ativos intactos. Não deve registrar tokens, identificadores de sessão ou dados pessoais nos logs.
10. Se a limpeza falhar, registrar o erro sem interromper login, autenticação ou outras operações da API. O atraso na limpeza pode manter linhas antigas por mais tempo, mas não pode revalidar uma sessão expirada ou revogada.
11. Para o deploy inicial com uma instância da API, manter o agendamento no próprio backend. Se houver múltiplas instâncias no futuro, garantir que execuções concorrentes permaneçam idempotentes ou eleger uma única instância responsável pela rotina.

**Critérios de aceite:** logout invalida imediatamente apenas a sessão atual; outras sessões do mesmo usuário continuam funcionando; troca/reset de senha e desativação invalidam todas as sessões; sessão inexistente, revogada, expirada ou pertencente a outro usuário recebe `401`; JWT sem tipo, `sid` ou `sub` válido é rejeitado; a rotina remove registros expirados e revogados, preserva os ativos e pode ser executada novamente sem alterar o resultado de autenticação.

**Impacto da publicação:** sessões ainda não registradas na tabela não passarão na nova validação. Após aplicar a migração e publicar a mudança, o corretor precisará entrar novamente em cada dispositivo.

**Áreas envolvidas:** `backend/prisma/schema.prisma`, nova migração, repositório e módulo de sessões, rotina agendada NestJS, `backend/src/common/auth/auth.service.ts`, `backend/src/common/auth/auth.guard.ts` e fluxos de login/logout/reset de senha.

## Fase 3 — Separar tokens de usuário e de integração

**Prioridade: alta.** O serviço de notificações assina tokens com o segredo usado para autenticação de usuários, e a validação não exige finalidade, audiência ou identidade de usuário. Um token da integração foi aceito como token autenticado em uma verificação local isolada.

1. Usar segredos diferentes para usuários e para a integração de notificações. A variável `NOTIFICATIONS_JWT_SECRET` já consta em um exemplo de ambiente e deve ser ligada ao cliente de notificações.
2. Definir e validar emissor (`iss`), audiência (`aud`) e finalidade (`tokenType`) para cada tipo de token.
3. Exigir `sub` e `sid` válidos em tokens de acesso de usuários; confirmar a sessão correspondente no banco.
4. Validar no startup que os segredos estão configurados em produção, têm força adequada e não são iguais.
5. Rotacionar os segredos durante a publicação, considerando que tokens anteriores deixarão de funcionar.

**Critérios de aceite:** token de serviço não autentica chamadas de usuário; token de usuário não é aceito como credencial da integração; tokens com emissor, audiência ou finalidade incorretos são rejeitados; API não inicia em produção com segredos ausentes ou iguais.

**Áreas envolvidas:** configuração de ambiente, módulos de autenticação/notificações, `auth.service.ts` e `notifications-ms.client.ts`.

## Fase 4 — Evitar enumeração de contas na recuperação de senha

**Prioridade: média.** Embora a mensagem final seja neutra, uma solicitação repetida dentro do cooldown gera `429` para conta existente, enquanto e-mail inexistente recebe a resposta normal. Falhas de envio também podem criar respostas diferentes.

1. Retornar o mesmo status e corpo para e-mail existente, inexistente, dentro do cooldown e falhas de envio.
2. Para uma conta em cooldown, não gerar nem enviar outro token, mas retornar a resposta neutra sem expor o tempo restante.
3. Manter limites por IP e regras internas contra abuso.
4. Registrar a solicitação antes de enviar o e-mail, para que uma falha do serviço externo não habilite tentativas ilimitadas.
5. Remover logs de corpos completos de respostas externas, que podem conter dados sensíveis.
6. Considerar uma fila ou padrão outbox em uma etapa posterior para reduzir diferenças de tempo observáveis e desacoplar a disponibilidade do serviço de e-mail.

**Critérios de aceite:** solicitações para e-mail existente ou inexistente têm mesma resposta observável; cooldown não revela cadastro; indisponibilidade do serviço externo não revela se a conta existe e não permite disparos ilimitados.

**Áreas envolvidas:** `backend/src/modules/user/services/user.service.ts`, `passwordReset.service.ts` e logs do cliente de notificações.

## Fase 5 — Atualizar dependências e reduzir exposição

**Prioridade: alta antes da produção.** A auditoria anterior encontrou alertas de dependências nos dois aplicativos, incluindo um alerta crítico relacionado à versão de Next.js em uso naquele momento.

1. Atualizar Next.js e Axios no frontend; atualizar os pacotes NestJS afetados, Swagger e Prisma no backend, mantendo versões compatíveis com os aplicativos.
2. Atualizar os dois lockfiles e conferir a instalação limpa a partir deles.
3. Executar novamente `npm audit --omit=dev` em backend e frontend; revisar alertas residuais por pacote, severidade, uso e possibilidade de exploração.
4. Mover ferramentas de desenvolvimento para `devDependencies` quando isso não prejudicar as operações de produção. Em particular, avaliar o Prisma CLI.
5. Restringir Swagger em produção ou protegê-lo por autenticação.
6. Validar variáveis de ambiente obrigatórias no startup. Em produção, falhar explicitamente se `JWT_SECRET`, `CSRF_SECRET` ou `DATABASE_URL` estiverem ausentes ou inválidos.
7. Revisar logs da integração e remover corpos externos que possam expor dados pessoais ou informações internas.
8. Revisar a CSP e planejar a remoção de `unsafe-inline` quando compatível com a aplicação.

**Critérios de aceite:** Next.js e Axios estão em versões corrigidas; lockfiles refletem as versões adotadas; builds e lint passam; alertas remanescentes estão identificados e justificados; configuração de produção não inicia com segredos essenciais ausentes.

## Validação de segurança

Cobrir os seguintes fluxos com testes automatizados backend e validação ponta a ponta quando o banco estiver disponível:

- cadastro público bloqueado;
- tentativa de consultar ou alterar outro usuário negada;
- mudança de e-mail e senha exige reautenticação;
- token ausente, inválido, expirado ou destinado à integração rejeitado;
- logout revoga apenas a sessão atual; troca de senha, redefinição e exclusão revogam todas as sessões;
- a limpeza agendada remove sessões expiradas/revogadas, preserva sessões ativas e tolera execução repetida;
- usuário excluído não acessa endpoints protegidos;
- recuperação de senha não revela se o e-mail existe;
- mutações sem CSRF são rejeitadas;
- origem fora da lista configurada é bloqueada por CORS.

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

1. Confirmar backup restaurável do banco.
2. Configurar segredos distintos e origens permitidas no ambiente de produção.
3. Aplicar a migração da tabela de sessões.
4. Publicar backend com cadastro fechado, autorização revisada e validação de sessão.
5. Publicar frontend sem a opção de cadastro.
6. Provisionar a conta única do corretor pelo procedimento administrativo definido.
7. Validar login, logout, reset de senha e revogação.
8. Verificar o ambiente da VPS — TLS/HTTPS, portas expostas, acesso externo ao PostgreSQL, firewall, usuário do processo e restauração do backup. Essa verificação operacional fica fora da análise da pasta `infra/`.
9. Acompanhar tentativas de login/recuperação e respostas `401`/`403` após a entrada em produção.

## Ordem recomendada

Fechar o cadastro e a autorização primeiro; implementar revogação e separar tokens em seguida; corrigir recuperação de senha e atualizar dependências antes do deploy. Considerar cadastro público, sessões sem revogação e tokens compartilhando segredo como bloqueadores para uma aplicação acessível pela internet.
