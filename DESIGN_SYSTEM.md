# Sistema visual — Insurance Management

**Atualizado em:** 18/10/2026
**Objetivo:** levar a identidade visual do app para uma landing page em outro repositório.

## Leitura rápida

- **Detectado:** o produto é um painel administrativo para operação de corretora de seguros. A interface combina azul petróleo, azul vivo para ações, superfícies claras, cartões discretos e gráficos em tons de ciano/azul.
- **Detectado:** a área autenticada usa a marca “Mainiere” na navegação; os metadados do site usam “Insurance Management”.
- **Detectado:** o app oferece tema claro e escuro. O tema claro é a melhor base para uma landing; o escuro pode ser usado em uma seção de destaque.
- **Inferência:** para uma landing, mantenha o azul petróleo como cor institucional e reserve o azul vivo para CTA e estados interativos. Não replique a sidebar administrativa no site público.
- **Pergunta em aberto:** qual nome e qual variante do logo serão a marca principal da landing: Mainiere ou Insurance Management?

## Personalidade visual

**Detectado:** o login apresenta o sistema como uma ferramenta simples e organizada para administrar clientes, seguradoras, gráficos e a operação da corretora. O painel prioriza leitura de dados e navegação funcional.

**Direção para a landing — Inferência:** transmitir confiança, clareza e organização. Usar linguagem visual B2B, com hierarquia tipográfica evidente, bastante espaço entre seções, ícones lineares e exemplos de interface do produto. A identidade não depende de fotografia ou ilustração no app atual; se forem adicionadas imagens, elas devem apoiar a mensagem sem competir com o produto.

## Cores

Os tokens abaixo vêm de `frontend/src/app/globals.css`. Para a landing, preserve a distinção entre o azul institucional e o azul de ação.

| Token / função | Tema claro | Tema escuro |
| --- | --- | --- |
| Ação principal | `#0073e6` | `#0073e6` |
| Hover da ação | `#0061c2` | `#0061c2` |
| Gradiente institucional | `#044766` → `#06608a` → `#0b7fb4` | `#01131c` → `#022b3d` → `#06445c` |
| Fundo | `oklch(1 0 0)` | `oklch(0.148 0.004 228.8)` |
| Texto principal | `oklch(0.148 0.004 228.8)` | `oklch(0.987 0.002 197.1)` |
| Cartão / superfície | `oklch(1 0 0)` | `oklch(0.218 0.008 223.9)` |
| Texto secundário | `oklch(0.56 0.021 213.5)` | `oklch(0.723 0.014 214.4)` |
| Superfície muted | `oklch(0.963 0.002 197.1)` | `oklch(0.275 0.011 216.9)` |
| Borda | `oklch(0.925 0.005 214.3)` | `oklch(1 0 0 / 10%)` |
| Erro/destrutivo | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |

O tema também define `--primary` separado da ação principal: `oklch(0.488 0.243 264.376)` no claro e `oklch(0.424 0.199 265.638)` no escuro. Os botões principais usam `--action-primary` (`#0073e6`), enquanto componentes shadcn podem usar `--primary`.

### Gradiente do painel de boas-vindas

O painel de autenticação usa uma variação específica: `linear-gradient(135deg, #03314a 0%, #06608a 50%, #138ec7 100%)`, com duas luzes radiais brancas em baixa opacidade. Para reproduzir exatamente o login, use essa variação. Para novos elementos institucionais, use o token `--brand-gradient` da tabela.

### Gráficos

Use a sequência existente, do azul claro ao azul petróleo:

```text
--chart-1: oklch(0.865 0.127 207.078)
--chart-2: oklch(0.715 0.143 215.221)
--chart-3: oklch(0.609 0.126 221.723)
--chart-4: oklch(0.52 0.105 223.128)
--chart-5: oklch(0.45 0.085 224.283)
```

## Tipografia

**Detectado:** `Inter` é a fonte ligada a `--font-sans` e usada como fonte geral. `Geist Mono` está disponível para código e conteúdo técnico. `Geist Sans` também é carregada, mas não é a fonte principal mapeada nos tokens atuais.

| Estilo do app | Tamanho | Peso / uso |
| --- | --- | --- |
| Display | 48 px | 600; títulos de grande destaque |
| H1 | 36 px | 600 |
| H2 | 30 px | 600 |
| H3 | 24 px | 600 |
| H4 | 20 px | 600 |
| Lead | 18 px | texto de apoio, cor secundária |
| Corpo | 16 px | line-height 28 px |
| Large | 18 px | 600 |
| Small / muted | 14 px | medium / texto secundário |

No painel do login, o título chega a 60 px, o subtítulo usa 20 px e o texto usa 16 px. Para uma landing, essa escala pode ser ampliada em telas grandes; **isso é uma adaptação**, não um token já existente.

## Forma, espaçamento e elevação

- **Detectado:** `--radius: 0.625rem` (10 px). Os cartões usam `rounded-xl` (aprox. 14 px); botões e campos usam `rounded-md` (aprox. 8 px).
- **Detectado:** cartões usam fundo de superfície, borda sutil (`ring-1 ring-foreground/10`), sombra pequena e padding de 24 px. Campos têm 36 px de altura; botões padrão também têm 36 px, com variantes de 32 px e 40 px.
- **Detectado:** o cabeçalho administrativo tem 56 px de altura. A composição do login vira duas colunas em telas grandes; o painel de marca fica oculto em telas menores.
- **Inferência para a landing:** mantenha uma escala de espaçamento baseada em múltiplos de 4 px (8, 12, 16, 24, 32, 48 e 64 px). Use containers centralizados e seções com respiro; reduza gaps e empilhe colunas no mobile.
- **Inferência para a landing:** use cartões para benefícios, recursos ou indicadores apenas quando facilitarem comparação. Prefira fundo branco e bordas suaves, deixando o gradiente para o hero ou uma seção de conversão.

## Componentes e estados

### Botões

- **Primário:** fundo `#0073e6`, texto branco; hover/foco `#0061c2`.
- **Outline:** superfície do fundo, borda neutra; hover com fundo `muted`.
- **Secondary:** superfície `secondary` e texto correspondente.
- **Ghost:** sem fundo permanente; hover com `muted`.
- **Destructive:** vermelho com fundo de baixa opacidade.
- Cantos arredondados, peso 500 e transições curtas. Estados de foco usam anel visível; estado desabilitado reduz opacidade e bloqueia interação.

### Campos e cartões

- Campos: borda neutra, fundo transparente ou da superfície, placeholder secundário; foco com borda/anel; erro com borda e anel destrutivos.
- Cartões: superfície de primeiro plano, título de 16 px/500, descrição de 14 px e espaçamento interno de 24 px.

### Ícones e marca

- **Detectado:** ícones da interface vêm de `lucide-react`, em estilo outline.
- Assets de marca existentes: `frontend/src/shared/assets/logo_branca.png`, `logo_branca_simplificada.png`, `logo_wm.png` e `wmainiere-logo.jpeg`.
- Confira contraste e variante do logo no outro repo antes de usar. Não redesenhe nem recolora o logo sem um arquivo de marca aprovado.

## Recomendações de aplicação na landing

Estas são orientações de adaptação, não páginas existentes no app:

1. Cabeçalho enxuto com logo, poucos links e um CTA principal azul.
2. Hero claro com título escuro, descrição curta e CTA; use o gradiente institucional como fundo de um painel ou detalhe de destaque.
3. Demonstre o produto com uma captura real do dashboard ou uma composição de cartões e gráficos baseada nos componentes existentes.
4. Repita a paleta azul dos gráficos em dados e indicadores; não use várias cores saturadas sem função semântica.
5. Termine com CTA e rodapé em alto contraste. Em mobile, mantenha o texto e a ação principal antes de elementos decorativos.

## Referências no código

- Tokens, tema claro/escuro e gradientes: `frontend/src/app/globals.css`.
- Fontes e aplicação global: `frontend/src/app/layout.tsx`.
- Escala de texto: `frontend/src/shared/components/ui/typography.tsx`.
- Botões: `frontend/src/shared/components/ui/button.tsx`.
- Cartões: `frontend/src/shared/components/ui/card.tsx`.
- Campos: `frontend/src/shared/components/ui/input.tsx`.
- Painel de marca do login: `frontend/src/features/Auth/components/brand-panel.tsx`.
- Shell administrativo: `frontend/src/shared/components/AppSidebar/app-sidebar.tsx` e `frontend/src/shared/components/AppHeader/app-header.tsx`.
- Tema dos gráficos: `frontend/src/shared/hooks/use-highcharts-theme.ts`.

**Desconhecido:** o código atual não define uma identidade visual específica para marketing, fotografia, ilustração, mensagens comerciais ou uma paleta de marca formal independente dos tokens do dashboard. Trate esses pontos como decisões do projeto da landing.
