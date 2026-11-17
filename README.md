# AgroGestor

Estado atual e resultados de validação: [status do projeto](docs/STATUS.md).

## Cadastro e autenticação Supabase

A rota `/cadastro` permite informar nome, e-mail, senha e confirmação. A integração
usa Supabase Auth, com confirmação de e-mail conforme configuração do projeto,
login, restauração de sessão e logout. Senhas não são gravadas pelo aplicativo.

Para conectar o banco AgroGestor, copie `.env.example` para `.env.local` e preencha
`EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a URL e a
chave **pública** do projeto `cijujvueodmjifvlqfxm`. Nunca use chave secret/service_role,
senha PostgreSQL ou JWT secret no frontend. Reinicie o Expo após alterar o ambiente.

No Supabase, habilite o provedor Email, configure Site URL/Redirect URLs para o
endereço da aplicação e o envio de mensagens de confirmação. Confirme o e-mail e
retorne ao login. A confirmação pelo navegador pode usar a sessão do link; no
mobile, confirme pelo navegador e entre no app com e-mail/senha.

Sem as duas variáveis, o cadastro mostra indisponibilidade. Quando ambas estão
ausentes, o login original de demonstração continua disponível. Uma configuração
parcial não habilita login de demonstração silenciosamente.

Novas contas recebem o perfil básico de proprietário/vendedor, sem vínculos de
propriedade. Apenas `app_metadata.role`, administrado no servidor, pode mudar o
papel; `user_metadata` contém somente dados de apresentação. Isso prepara a UI,
mas os futuros dados de negócio ainda precisam de tabelas e RLS no servidor.

O cadastro é persistido pelo próprio Supabase Auth em `auth.users`. Não é preciso
criar uma tabela pública nem armazenar senhas em tabelas próprias nesta etapa.

Diagnóstico, plano e pendências: [cadastro e requisitos](docs/CADASTRO-E-REQUISITOS.md).

## Fundação original de demonstração

Primeiro protótipo funcional para gestão rural e Mercado Rural. Todo dado é fictício.
Os módulos de negócio continuam usando dados simulados. A autenticação real depende
da configuração Supabase acima; pagamentos e módulos de produção ainda não existem.

## Iniciar

Requisitos: Node 22.22+ e npm. O lockfile é `package-lock.json`.

```sh
cd AgrogestorFRONT
npm ci
npm run web
```

Web: abrir o endereço informado pelo Expo, normalmente `http://localhost:8081`.

Mobile:

```sh
npm start
```

Escanear o QR code com um Expo Go compatível com SDK 57, no mesmo Wi-Fi. Para
emulador Android configurado, usar `npm run android`. `npm run ios` exige macOS e
simulador iOS. Em Windows, a opção iOS é um dispositivo físico compatível.

## Contas de demonstração

Senha pública para todas: **`Demo@123`**. Não use credenciais reais.

| E-mail | Perfil |
|---|---|
| admin@agrogestor.demo | Administrador |
| usuario@agrogestor.demo | Proprietário / Vendedor |
| tecnico@agrogestor.demo | Técnico |
| operador@agrogestor.demo | Operador |
| comprador@agrogestor.demo | Comprador |
| parceiro@agrogestor.demo | Parceiro |

Sessão de demonstração local de 24 horas, contendo apenas versão, ID do usuário e
validade. Nenhuma senha é armazenada. O perfil é recuperado do catálogo mock.
Isso não impede manipulação do cliente: guards locais não são segurança de produção.

## Fluxos

Visitante → Landing → Login → Página do Usuário → Home

Administrador → Login → Painel Administrativo → Dashboard Admin

Visitante → Mercado público → Oportunidade → Favoritar / Interesse / Negociar → Login

O administrador também pode entrar na área do usuário. Comprador e parceiro não
recebem dados privados de fazendas. O parceiro visualiza somente o exemplo de
negociação no qual está listado como participante. O operador tem uma seleção
essencial de módulos, sem estoque e histórico gerencial.

## Rotas

| Contexto | URL | Conteúdo |
|---|---|---|
| Público | `/` | Landing |
| Público | `/mercado` | Mercado com busca e categorias |
| Público | `/oportunidade/:id` | Detalhes e ações mock |
| Auth | `/login` | Login Supabase ou demonstração, conforme ambiente |
| Auth | `/cadastro` | Cadastro por Supabase Auth |
| Usuário | `/usuario` | Página de entrada autenticada |
| Usuário | `/home` | Dashboard e quatro acessos |
| Usuário | `/fazenda` | Shell da gestão rural |
| Usuário | `/fazenda/:module` | Talhões, atividades, estoque, alertas, histórico |
| Usuário | `/mercado-rural` | Mercado autenticado e favoritos da sessão |
| Usuário | `/negocios` | Categorias de acompanhamento |
| Usuário | `/perfil` | Dados, modos de uso, ajuda e logout |
| Admin | `/admin` | Painel de entrada |
| Admin | `/admin/dashboard` | Dashboard Admin |
| Admin | `/admin/modulo/:module` | Módulos administrativos navegáveis |

Módulos de fazenda: `talhoes`, `atividades`, `estoque`, `alertas`, `historico`.

Módulos admin: `propriedades`, `talhoes`, `culturas`, `atividades`, `estoque`,
`alertas`, `relatorios`, `usuarios`, `configuracoes`, `marketplace`, `negociacoes`,
`documentos`, `credito`, `contratos`.

IDs públicos de oportunidades: `boa-vista`, `nelore`, `milho`, `arrendamento`.
URLs desconhecidas possuem estado amigável para voltar. Grupos entre parênteses
do Expo Router organizam o código e não fazem parte da URL.

## Arquitetura

```text
app/                    Rotas Expo Router e layouts com guards
  (public)/             Landing, mercado e oportunidade
  (auth)/               Login
  (user)/               Entrada, Home e módulos do cliente
  (admin)/              Entrada e dashboard administrativo
src/
  auth/                 Contexto de sessão e matriz de permissões
  components/           Componentes visuais universais e estados
  contexts/             Preferências de demonstração e favoritos
  hooks/                Carregamento de recursos com retry/cancelamento
  mocks/                Usuários, fazendas, indicadores, mercado e negócios
  navigation/           Configuração dos módulos e atalhos
  screens/              Telas completas
  services/             Auth, Property, Dashboard, Marketplace, Negotiation
  theme/                Cores, espaçamento e raios
  types/                Entidades e estados de conectividade/sincronização
tests/                  Testes de domínio e sessão com Vitest
e2e/                    Fluxos reais no Chromium desktop e mobile com Playwright
docs/                   Plano, relatório, inventário e capturas
```

As telas consomem serviços; os serviços recebem mocks. O catálogo público não
deriva do cadastro privado da fazenda. As fotografias ilustrativas são distribuídas com o aplicativo em
`assets/photos`. As imagens do catálogo representam as categorias dos anúncios fictícios.

Fotografias do [Pexels](https://www.pexels.com/license/):

- [Campos de São Simão](https://www.pexels.com/photo/31329145/), Clodoaldo Franco.
- [Propriedade em Barra do Turvo](https://www.pexels.com/photo/17086468/), Threze Gue.
- [Gado Nelore em Porto Feliz](https://www.pexels.com/photo/31026897/), Matheus Lara.
- [Espiga de milho](https://www.pexels.com/photo/35072884/), Valentin Ivantsov.
- [Área rural de Maringá](https://www.pexels.com/photo/14515234/), Vidal Balielo Jr.
- [Lavoura de soja](https://www.pexels.com/photo/38740388/), Clinton Weaver.
- [Frutos de café](https://www.pexels.com/photo/1556665/), Daniel Reche.
- [Angus](https://www.pexels.com/photo/11556841/), Fernando Mamberti.
- [Holandês](https://www.pexels.com/photo/7115025/), Mark Stebnicki.

## Exemplos de produção e visual dinâmico

Minha Fazenda e o menu administrativo incluem **Culturas e Safras** e
**Rebanhos e Raças**. Os exemplos apresentam sete culturas em três safras
(2025/26, 2026/27 e 2027/28), além de sete lotes de raças de corte e leite.
Os filtros atualizam os cartões e os totais. Selecione um cartão para abrir
os detalhes. Os dados são fictícios e consultados conforme o vínculo do
perfil de demonstração com a propriedade.

O Mercado Rural apresenta oito anúncios, com busca por cultura, raça,
safra e região. Nas categorias Gado e Produção agrícola, filtros adicionais
permitem combinar raça/finalidade e cultura/safra. As fotografias são ilustrativas.

No navegador, Three.js desenha curvas de nível sutis nas faixas de destaque.
O módulo carrega sob demanda, reage ao cursor e pausa fora da área visível
ou com a aba oculta. A preferência de movimento reduzido produz uma imagem
estática. Sem WebGL2 e nas versões nativas, a faixa usa seu fundo verde.
Os exemplos de produção são demonstrativos e não gravam operações no banco.

## Verificações

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run build:mobile
npx expo install --check
```

O Playwright inicia o Expo Web se não houver servidor local. Os testes utilizam
uma sessão isolada por caso e verificam erros e warnings do console. Capturas
das telas principais são salvas em `docs/screenshots`.

`build` gera `dist` local. `build:mobile` gera bundles JS/Hermes em `dist-native`;
não gera APK/IPA e não comprova execução em aparelho. Nenhum comando faz deploy.

Os testes de demonstração usam a porta 8082 com ambiente isolado. Para a
validação opt-in da autenticação real, use `npm run test:e2e:live`; os detalhes
da conta temporária estão em `docs/CADASTRO-E-REQUISITOS.md`.

## Limites da fase

- Favoritos são locais à sessão aberta e reiniciam ao trocar de usuário/recarregar.
- Interesse e negociação apenas exibem feedback; não enviam mensagens.
- Modos Simplificado e Assistido alteram a Home durante a sessão aberta.
- Ajuda humana informa a indisponibilidade sem enviar solicitação.
- NetInfo detecta conectividade; pendência de sincronização é um exemplo visual.
- Não há fila real, service worker ou garantia de abertura web sem rede.
- Módulos de gestão e administração, crédito e contratos são shells explícitos.
- Autorização e autenticação reais devem existir no backend de uma fase futura.

Resultados efetivamente executados e pendências: [relatório da fase 1](docs/DELIVERY.md).
