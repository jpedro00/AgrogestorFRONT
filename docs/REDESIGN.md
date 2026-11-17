# Redesign — 17/11/2026

Direção natural: verde profundo, neutros quentes, fotos locais e hierarquia editorial.
Landing redesenhada; paleta e cartões compartilhados atualizam login, cadastro e painéis.
Banners têm foto de lavoura e relevo animado via Three.js.
Three.js é carregado dinamicamente, limita resolução e pausa fora da tela; respeita movimento reduzido.
Vídeo web inicia apenas por clique, com controles nativos e imagem alternativa em caso de falha.
No aplicativo nativo, o componente de vídeo exibe a fotografia local.

Referências de composição (sem copiar identidade ou material proprietário):
- https://www.deere.com.br/pt/tecnologia-de-produtos/agricultura-de-precis%C3%A3o/
- https://www.syngentadigital.ag/

Vídeo: Declan Conor / Pexels, 5 segundos, 1920x1080.
https://www.pexels.com/video/drone-flying-over-an-agricultural-field-4907896/
Licença: https://www.pexels.com/license/
Fotografias: acervo já presente em assets/photos; créditos originais preservados.

Escopo visual: não cria tabelas nem substitui dados de demonstração dos módulos de negócio.

Validação desta entrega: TypeScript e lint passaram; 33 testes unitários e 26 testes E2E passaram. Layout inspecionado em desktop/mobile. Vídeo verificado no navegador com readyState=4, largura 1920 e reprodução efetiva. Servidor de revisão: http://localhost:8081/.
