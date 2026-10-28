# Cadastro e diagnóstico — 27/10/2026

## Estado encontrado

Frontend Expo/React Native Web com dados fictícios e autenticação local MockAuthService. Backend contém apenas README e licença. Não há cadastro, integração HTTP de negócio, esquema SQL ou configuração de banco no checkout. Não foi encontrado um documento completo de requisitos além de README, IMPLEMENTATION e DELIVERY.

Registro histórico mencionava Supabase/Postgres 17.6, sem tabelas públicas. A conexão do plugin não tinha acesso ao AgroGestor. O projeto correto foi identificado pelo usuário e acessado diretamente pela API com as credenciais fornecidas para ele.

Atualização: o usuário identificou o AgroGestor como `cijujvueodmjifvlqfxm` e reativou o projeto. A API de autenticação respondeu HTTP 200, com cadastro por email habilitado e confirmação obrigatória. Configuração pública gravada em `.env.local`, ignorado pelo Git. As credenciais de outro projeto enviadas por engano foram desconsideradas.

Inspeção da API REST do AgroGestor retornou esquema sem tabelas de negócio expostas. Usuários são persistidos pelo Supabase Auth; nenhuma tabela de negócio foi criada ou modificada. Testes reais criaram contas temporárias, validaram login e confirmação sem enviar emails. As duas contas temporárias foram removidas; a ausência da conta de login foi confirmada por HTTP 404. O arquivo temporário de credenciais também foi removido.

## Implementação desta etapa

Manter Expo e componentes existentes. Criar `/cadastro`, nome, email, senha e confirmação; validação e mensagens acessíveis; login, confirmação por email, restauração e logout por Supabase Auth. Não armazenar senhas no aplicativo. Papéis vêm exclusivamente de metadados administrados pelo servidor; novos usuários não recebem propriedades de demonstração. Usar chave pública e URL por ambiente. Cadastro sem configuração deve informar indisponibilidade, sem simular sucesso.

### Plano de execução

1. Testar validação, normalização e impossibilidade de elevar privilégios por user_metadata.
2. Implementar serviço Supabase e integrar AuthContext, preservando demonstração quando não configurado.
3. Criar tela responsiva e links de entrada; diferenciar conta real e demonstração.
4. Testar unitários, tipos, lint, build web e navegação desktop/mobile.
5. Após identificação do banco: inspecionar estado/esquema, restaurar se necessário, configurar URL/chave pública e validar cadastro/login reais.

## Lacunas para o produto completo

| Área | Falta |
| --- | --- |
| Autenticação | Cadastro/login integrados; faltam recuperação de senha, administração de convites e política de contas para produção |
| Entrega de e-mail | Validar recebimento em uma caixa real e configurar SMTP/domínio de produção; o teste automatizado não envia mensagens |
| Gestão rural | CRUD persistente de propriedades, vínculos de usuários, talhões, culturas, atividades, estoque e alertas |
| Segurança de dados | Esquema de negócio, autorização no servidor, RLS por propriedade e testes entre usuários |
| Mercado Rural | Publicação/edição de anúncios, upload de imagens, favoritos persistentes e moderação |
| Negociações | Persistência, participantes, histórico e transições de estado |
| Administração | Gestão efetiva de usuários e permissões, relatórios, configurações e auditoria |
| Documentos, crédito e contratos | Regras de negócio, armazenamento, integrações e fluxos ainda não especificados |
| Offline | Fila real, resolução de conflitos e sincronização |
| Operação | Deploy, backups, monitoramento, configuração de produção e validação em aparelhos Android/iOS |

Não confundir telas navegáveis com módulos implementados. Esta etapa trata cadastro/autenticação; as demais lacunas permanecem explícitas até serem implementadas e verificadas.

## Verificação e manutenção

- Testes unitários: 32 casos de autenticação demo, permissões, dados e integração com SDK.
- Autenticação no navegador: quatro testes passaram, em desktop e celular; login, restauração, perfil e logout usam o Supabase real. Cadastro com token de confirmação também foi validado diretamente na API, sem disparar email.
- Regressão completa: 22 testes de navegação passaram em desktop e celular, incluindo indicador offline.
- TypeScript e ESLint passaram; exportação web e bundles Hermes Android/iOS foram gerados. O identificador correto do AgroGestor foi conferido nos três bundles. A exportação web não contém chaves secretas nem configuração do projeto enviado por engano.
- Os scripts de build limpam o cache Metro para evitar reutilizar valores vazios da configuração de demonstração dos testes. A exportação web inicial detectada sem configuração foi descartada e refeita com cache limpo.
- `npm run test:e2e` usa servidor isolado na porta 8082 e desabilita carregamento de `.env`, para contas demo nunca serem enviadas ao Supabase real.
- `npm run test:e2e:live` usa `.env.local` e servidor na porta 8083. Exige `AGROGESTOR_TEST_ACCOUNT` apontando para JSON fora do repositório com `email` e `password` de conta descartável confirmada. Não incluir chave administrativa nesse arquivo. O teste de confirmação da tela intercepta somente a resposta de signup para não enviar email; o teste de login usa Supabase real.
- Os testes revelaram falha preexistente de detecção offline no Chromium com `navigator.connection`. O indicador agora também acompanha os eventos `online`/`offline` do navegador.
- Auditoria npm da implementação: o alerta crítico foi eliminado atualizando apenas `shell-quote` dentro da faixa compatível. Naquela execução restaram 14 alertas (8 moderados e 6 altos), sem críticos. A revalidação para publicação encontrou 19 alertas; consulte `STATUS.md` para o resultado atual. Não foi aplicado `audit fix --force`, pois há propostas de troca incompatível do Expo. Reavaliar dependências antes de produção.
- Execução nativa em aparelho e entrega de e-mail não foram validadas.
