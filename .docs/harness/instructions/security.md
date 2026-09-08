# Seguranca

## Controles detectados

- `backend/src/main.ts` aplica Helmet, CORS por `ALLOWED_ORIGINS` e `ValidationPipe` com `whitelist`, transformacao e rejeicao de campos extras.
- `AuthGuard` global exige Bearer JWT, exceto handlers `@Public()` e URLs de Swagger em `/docs`.
- Rotas publicas: `GET /`, registro, login, forgot-password e reset-password.
- Throttling global: 100 requests/minuto. Registro/login: 5/minuto; forgot-password: 3/minuto; reset-password: 4/minuto.
- Senhas usam bcrypt com custo 10. Senhas aceitas tem no minimo oito caracteres, maiuscula, minuscula, numero e caractere especial.
- Reset usa 32 bytes aleatorios, armazena SHA-256 do token, expira por padrao em 30 minutos e evita nova solicitacao por usuario dentro de 60 segundos.
- O frontend define CSP e headers defensivos em `frontend/next.config.ts`.

## Regras

- Nunca exponha ou versione `DATABASE_URL`, `JWT_SECRET`, tokens, senhas/hashes, chaves externas ou PII de clientes.
- Nao enfraqueca `@Public()`, CORS, CSP, ValidationPipe, throttling ou timeouts sem justificativa e teste.
- Toda rota nova e protegida por padrao. Use `@Public()` somente quando o contrato exigir e cubra enumeracao, brute force e abuso.
- Nao retorne `password`, hashes/tokens de reset ou detalhes internos das integracoes.
- Preserve a resposta neutra de forgot-password para e-mails inexistentes.
- Valide autorizacao separadamente da autenticacao ao introduzir papeis ou ownership; hoje nao ha controle granular detectado.
- Clientes HTTP externos devem manter timeout e traduzir falhas sem vazar corpo sensivel. HTML de recuperacao usa dados do usuario: qualquer ampliacao deve escapar conteudo nao confiavel.

## Configuracao e lacunas

- **Detectado:** `DATABASE_URL` e `JWT_SECRET` caem para string vazia e nao ha validacao explicita de startup.
- **Detectado:** Swagger e liberado pelo guard em qualquer ambiente.
- **Detectado:** qualquer JWT valido tem acesso equivalente a todas as rotas protegidas.
- **Pergunta em aberto:** requisitos de papeis, politica de sessao/revogacao, disponibilidade publica do Swagger e validacao obrigatoria de ambiente.
