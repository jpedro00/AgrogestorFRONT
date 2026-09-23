# Entrega — AgroGestor, Fase 1

Fundação frontend implementada. Validação web e bundles locais descritos abaixo.
A execução em aparelho Android/iOS ainda precisa de validação; por isso o aceite
nativo integral permanece aberto. Nenhum commit, push, deploy ou backend foi criado.

## 1. Arquitetura encontrada

`AgrogestorFRONT` e `AgrogestorBACK` eram repositórios independentes contendo apenas
README e licença. Não havia package.json, lockfile, framework, TypeScript, rotas,
componentes, telas, assets, hooks, stores, estilos, configurações ou testes.
Nenhuma aplicação existente foi substituída. Não havia referência visual local.

## 2. Arquitetura final

Expo SDK 57.0.24, React 19.2.3, React Native 0.86.3, React Native Web 0.21.2,
Expo Router 57.0.22 e TypeScript 6.0.3. npm com lockfile reproduzível.

Rotas por arquivo em quatro grupos; layouts de usuário e admin aplicam guards.
Context API contém sessão, preferências e favoritos temporários. Telas consomem
serviços leves com mocks centralizados. Serviços de gestão verificam perfil e
vínculo de propriedade; catálogo de oportunidades é público e independente.

Componentes comuns: AppButton, AppInput, Screen, Header, StatCard, QuickActionCard,
ModuleCard, OpportunityCard, EmptyState, LoadingState, ErrorState, RestrictedState,
RoleBadge, AdminSidebar e ConnectivityIndicator. Tema centralizado e ilustrações
vetoriais locais. Interface com SafeArea, ScrollView, grids responsivos, navegação
inferior do usuário e sidebar administrativa em telas largas.

O uso de rotas por arquivo segue a [documentação do Expo Router](https://docs.expo.dev/router/introduction/).
As versões foram conferidas com `npx expo install --check`, que retornou
`Dependencies are up to date`.

## 3. Arquivos criados

O [inventário completo](FILES.md) lista cada arquivo. Principais grupos:

- `app/`: layouts, rotas públicas, auth, usuário, admin e página não encontrada.
- `src/auth/`: MockAuthService conectado ao contexto e matriz de permissões.
- `src/components/`: componentes universais, estados e ilustração rural.
- `src/screens/`: sete telas prioritárias e shells de módulos.
- `src/services/`: auth, propriedade, dashboard, mercado e negócios.
- `src/mocks/`: usuários, propriedades, dashboard, oportunidades e negociações.
- `src/types/`, `src/theme/`, `src/hooks/`, `src/contexts/`, `src/navigation/`.
- `tests/`, `e2e/`, configurações Expo, TypeScript, ESLint, Vitest e Playwright.
- `package.json`, `package-lock.json`, `.gitignore` e documentação em `docs/`.
- Capturas desktop e mobile das telas iniciais em `docs/screenshots/`.

## 4. Arquivos alterados

Único arquivo preexistente alterado: `README.md`, ampliado com execução,
arquitetura, rotas, contas demo e limites. Licenças preservadas.
`AgrogestorBACK` permanece sem alterações, confirmado com `git status --short`.

## 5. Dependências e motivos

| Dependências diretas | Finalidade |
|---|---|
| expo, react, react-native | Aplicação universal e runtime nativo |
| expo-router | Navegação por arquivos e grupos |
| react-dom, react-native-web | Renderização web dos componentes nativos |
| react-native-safe-area-context, react-native-screens | SafeArea e suporte das telas nativas |
| expo-linking, expo-constants | Integração de rotas e metadados Expo |
| expo-status-bar | Barra de status nativa |
| expo-font, @expo/vector-icons | Ícones acompanhados de texto; importação direta de Ionicons |
| react-native-svg | Ilustrações locais, sem provedor remoto |
| @react-native-async-storage/async-storage | Persistência mínima da sessão mock |
| @react-native-community/netinfo | Indicador real de conectividade |
| react-native-reanimated, react-native-worklets | Pares nativos alinhados às dependências do Router/SDK |
| typescript, @types/react, @types/node | Tipagem da aplicação e ferramentas de testes |
| eslint, eslint-config-expo | Lint compatível com Expo |
| vitest | Testes de autenticação, sessão, permissões e dados |
| @playwright/test | Testes reais de navegação desktop/mobile web |
| prettier | Formatação legível e consistente |

Não há SDK de banco, API de negócio, Supabase, Firebase ou autenticação externa.

## 6. Mapa de rotas

| Grupo | Rotas |
|---|---|
| `(public)` | `/`, `/mercado`, `/oportunidade/:id` |
| `(auth)` | `/login` |
| `(user)` | `/usuario`, `/home`, `/fazenda`, `/fazenda/:module`, `/mercado-rural`, `/negocios`, `/perfil` |
| `(admin)` | `/admin`, `/admin/dashboard`, `/admin/modulo/:module` |

Os grupos não aparecem na URL. Módulos e IDs aceitos estão enumerados no README.
Rotas e identificadores inválidos mostram retorno amigável. Área não autorizada
mostra estado restrito; visitante é encaminhado ao login.

## 7. Contas mock

Senha pública de todas: `Demo@123`.

| Conta | Perfil |
|---|---|
| admin@agrogestor.demo | administrador |
| usuario@agrogestor.demo | proprietario_vendedor |
| tecnico@agrogestor.demo | tecnico |
| operador@agrogestor.demo | operador |
| comprador@agrogestor.demo | comprador |
| parceiro@agrogestor.demo | parceiro |

Chave local: `agrogestor.demo.session.v1`. Conteúdo: versão, userId, expiresAt.
Validade de 24 horas verificada ao restaurar. Logout remove essa chave. Senha
nunca é persistida. Autenticação mock e guards não são segurança de produção.

## 8. Executar mobile

```sh
cd AgrogestorFRONT
npm ci
npm start
```

Usar Expo Go compatível com SDK 57 e ler o QR code. Android configurado:
`npm run android`. iOS no simulador exige macOS: `npm run ios`.
Não foram encontrados adb, emulador ou Android SDK no ambiente; Windows também
não executa simulador iOS. Não foi feita validação em dispositivo físico.

## 9. Executar web

```sh
cd AgrogestorFRONT
npm ci
npm run web
```

Abrir o endereço exibido pelo Expo, normalmente `http://localhost:8081`.
Servidor web local iniciou e os fluxos foram exercitados pelo Playwright.

## 10. Testes e resultados

Não existiam testes anteriores. Novos testes:

- `tests/auth.test.ts`: 14 casos, incluindo login válido/inválido, campos,
  logout, restauração, corrupção/expiração, falha de armazenamento e guards.
- `tests/data.test.ts`: 6 casos, incluindo separação público/privado,
  propriedade autorizada, escopo do parceiro e recusa do serviço admin.
- `e2e/flows.spec.ts`: fluxos prioritários em Chromium desktop e Pixel 7 emulado;
  captura de telas e monitoramento de erros/warnings no console.
- `e2e/modules.spec.ts`: shells, favoritos, restrição de comprador,
  preferências e transição de conectividade.

`npm test`: **20/20 passaram**. Resultado final E2E será registrado ao terminar a rodada.

A rodada inicial revelou botões de login com nome acessível duplicado e strings
vazias/espaços soltos como filhos de View; ambos corrigidos. Fluxos com múltiplas
navegações excederam o limite inicial de 30s no Metro local. O limite por teste
foi ajustado para 120s, mantendo expectativas de comportamento e sem retries
automáticos para ocultar falhas.

## 11. Build, TypeScript, lint e revisão

| Checagem | Resultado real |
|---|---|
| `npm run typecheck` | Passou |
| `npm run lint` | Passou, zero erros e warnings |
| `npm test` | 20 testes passaram |
| `npm run build -- --max-workers 2` | Passou; exportação web em `dist` |
| `npm run build:mobile -- --max-workers 2` | Passou; bundles Hermes Android/iOS em `dist-native` |
| `npx expo install --check` | Dependências compatíveis |
| Revisão independente somente leitura | Nenhum bug importante confirmado |
| Execução nativa Android/iOS | Não realizada: sem dispositivo/emulador |

Importar apenas Ionicons reduziu o bundle JS web de aproximadamente 1,7 MB para
1,3 MB e removeu as demais fontes de ícones da exportação web.

Avisos do ambiente/ferramentas: conflito NO_COLOR/FORCE_COLOR no terminal;
depreciação transitiva de uuid e da versão ESLint utilizada pelo preset Expo;
aviso de resolução ESM de worklets durante a instalação. São distintos do console
da aplicação no navegador. O conflito inicial de pares worklets/reanimated foi
corrigido usando as versões indicadas por `expo install`.

`npm audit`: 13 avisos moderados, zero altos/críticos. Cadeias principais:
`xcode → uuid` e `expo-router → query-string → decode-uri-component`.
O npm propõe downgrades incompatíveis (Expo 46 / Router 5), por isso nenhum
`audit fix --force` foi aplicado. Reavaliar atualizações compatíveis antes de
qualquer uso além deste protótipo local.

## 12. Pendências e limite de aceite

- Validar em aparelho Android e iOS compatíveis; bundles e viewport mobile não
  substituem a execução nativa, teclado, SafeArea e navegação pelo sistema.
- Fazer revisão humana das telas e da linguagem com o público rural.
- Reavaliar avisos transitivos de dependências em atualização compatível.
- Shells, ajuda humana, autorização real, persistência de negócio, fila offline,
  crédito, contratos e documentos permanecem deliberadamente sem implementação.

## 13. Preparação para a próxima fase

Tipos User, Property, DashboardSummary, Activity, Plot, Alert, Opportunity,
Negotiation, Connectivity e SyncStatus; permissões por papel; estados loading,
error, empty, restricted, offline, pending e syncing; fronteiras de serviços que
podem receber implementações futuras; módulos públicos e privados separados.
Preferências alteram a Home e favoritos funcionam localmente durante a sessão.
Nenhum trabalho de fase seguinte foi iniciado.

## Fluxo entregue

Visitante → Landing → Login → Página do Usuário → Home

Administrador → Login → Painel Administrativo → Dashboard Admin

Explorar Mercado Rural → Mercado público → Oportunidade → Interagir → Login
