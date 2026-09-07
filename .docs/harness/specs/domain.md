# Dominio detectado

## Agregados e termos

- **User:** identidade autenticavel com nome, e-mail, senha e estado de recuperacao.
- **InsuranceCompany:** seguradora identificada por nome e cor usada em visualizacoes.
- **ProductType:** categoria/cobertura de seguro; possui ID textual e descricao.
- **Product:** oferta de uma seguradora para exatamente um tipo de produto.
- **Client:** pessoa fisica ou juridica, identificada por e-mail e pelo menos CPF ou CNPJ, com endereco e produtos contratados/associados.
- **Address:** endereco 1:1 pertencente ao cliente.
- **Visit:** compromisso datado, nomeado e descrito, pertencente a um cliente.
- **ChartType:** tipo visual e preset de tamanho (`1x1`, `2x1`, `4x4`, `8x4`).
- **Chart:** configuracao ordenada de widget, com tipo, rota de dados e unidade opcional.
- **Notification log/template:** representacoes adaptadas de um servico externo, nao agregados Prisma locais.

## Relacoes

- InsuranceCompany 1:N Product.
- ProductType 1:N Product.
- Client N:N Product.
- Client 1:1 Address.
- Client 1:N Visit.
- ChartType 1:N Chart.

## Invariantes implementadas

- E-mails de User e Client sao unicos no banco; CPF e CNPJ de Client tambem sao unicos quando presentes.
- O DTO de Client exige ao menos CPF ou CNPJ, telefone com 10-15 digitos, birthDate ISO e endereco.
- Produtos associados na criacao/edicao do cliente precisam existir e estar ativos.
- Senhas tem no minimo oito caracteres e quatro classes de caracteres.
- IDs de delete batch devem ser strings, nao vazios e sem duplicatas.
- Operacoes de leitura/edicao dos agregados soft-delete tratam `deletedAt != null` como inexistente.

## Ciclo de vida

- Soft delete: User, InsuranceCompany, ProductType, Product e Client.
- Campo `deletedAt` existe tambem em Address e Visit.
- **Detectado:** a rota atual de Visit faz delete fisico. Chart e ChartType nao possuem `deletedAt` e tambem sao apagados fisicamente.
- **Detectado:** o frontend faz exclusao em lote para os CRUDs tabulares e exclusao individual para Visit.

## Pontos de atencao

- O model Prisma se chama `Products` no plural, enquanto dominio/API usam Product/products.
- `birthDate` e obrigatorio inclusive quando o cliente e identificado apenas por CNPJ.
- Campos unicos combinados com soft delete podem impedir recriacao com o mesmo valor; confirme comportamento antes de mudar.
- Nao ha conceito de apolice, premio, vigencia, sinistro ou pagamento detectado, apesar do dominio de seguros.
