# Fundação frontend — Fase 1

## Diagnóstico
Os repositórios FRONT e BACK continham somente README e licença. Nenhum manifest,
lockfile, aplicação, teste, asset ou protótipo visual existente. Node 22 e npm 10
disponíveis. O backend permanece intocado.

## Design e arquitetura
O briefing do usuário é a especificação desta fase e autoriza implementar após
o diagnóstico. Aplicação universal Expo, TypeScript estrito, Expo Router e React
Native Web. Rotas finas em app; telas, componentes, tema, tipos, contextos,
serviços e mocks em src. Context API para sessão e preferências da demonstração.
Somente o identificador de sessão mock e sua validade são persistidos; nenhuma senha.
As permissões são verificadas também nos serviços mock de gestão. Mercado contém
somente oportunidades públicas independentes dos dados privados da propriedade.

Visual: verde escuro, fundo claro, cartões brancos, tipografia legível e áreas de
toque de pelo menos 44px. Landing curta com ilustração rural local; dashboard com
resumos, atividades e quatro acessos. Mobile com navegação inferior e SafeArea;
admin desktop com sidebar. Estados de rede são informativos, sem sincronização real.

## Execução (nesta sessão, sem commit, push ou deploy)
- [ ] Configurar Expo e dependências compatíveis, TypeScript, ESLint e testes.
- [ ] Escrever testes de autenticação, persistência e permissões; observar falhas.
- [ ] Implementar tipos, mocks, serviços, sessão e guards.
- [ ] Implementar componentes e as sete telas prioritárias.
- [ ] Conectar shells da fazenda, negócios, perfil e administração.
- [ ] Validar fluxos de navegação, estados e responsividade.
- [ ] Executar testes, lint, typecheck, exportação web e bundles nativos.
- [ ] Documentar resultados reais, inventário e limitações de validação nativa.

## Casos adicionais de revisão
Sessão inválida/expirada; falha no armazenamento; URL administrativa direta;
comprador/parceiro sem propriedade; acesso público sem vazamento de gestão.
Testar também restauração e logout seguidos de acesso direto a rota protegida.

## Limites
Mock não é autenticação segura. Guards locais não substituem autorização no servidor.
Sem banco, HTTP de negócio, backend, upload, pagamentos, mapas ou offline completo.
Sem criação de projeto externo de design: a pré-verificação opcional do CLI falhou
por indisponibilidade de pacote no cache; a interface será construída localmente.
