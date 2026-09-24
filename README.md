# Parafa CNPJ — Next.js

Frontend do diretório público, conectado à API CNPJ do `parafa.4.0-backend`.

## Desenvolvimento e validação

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Se o ambiente restringir as portas internas do Turbopack, use `npm run build -- --webpack`.
O build baixa a fonte do Google; precisa de rede na primeira execução.

## Configuração

- `API_URL`: URL interna da API, com `/api` no final. No Docker: `http://cnpj-api/api`.
- `NEXT_PUBLIC_GA_ID`: medição GA4; padrão já existente `G-ZPRHZCQG09`.
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: publisher AdSense; padrão já existente `ca-pub-9322585020374860`. Se mudar, atualizar também `public/ads.txt`.
- `CNPJ_EXTRA_AD_SLOT`: opcional. ID de um bloco AdSense para testar uma segunda posição na ficha, após o conteúdo. Vazio mantém o experimento desligado. É uma variável de runtime e está exposta no Compose.

## Ordem para publicar esta migração

1. No backend, executar a migration `2026_09_23_204634_create_cnpj_privacy_tables.php` na conexão `pgsql2`, que precisa de permissão para criar as duas tabelas. Ela não altera nem apaga a tabela de empresas.
2. Configurar SMTP e `CNPJ_SITE_URL=https://cnpj.parafa.com.br` no backend. Mailers `log` e `array` não são aceitos para solicitações em produção.
3. Publicar a API com os endpoints de solicitações, atividades secundárias e sitemaps. A base CNPJ deve conter a tabela `secondary_activities` do monolito.
4. Publicar este frontend. Invalidar qualquer cache anterior no proxy/CDN e respeitar `private, no-store` nas respostas de dados CNPJ; não aplicar uma regra global de cache de HTML/XML.
5. Conferir contato, ficha, formulário com uma caixa de teste, confirmação e acompanhamento. Não executar uma aprovação de remoção sobre um cadastro real apenas para testar.
6. Enviar `/sitemap.xml` ao Search Console e conferir `ads.txt` no AdSense. O novo índice substitui os fragmentos de sitemap gerados pelo Elasticsearch do monolito; eles não são mapeados por número, pois os identificadores não têm equivalência garantida.

## Privacidade e cache

As solicitações são analisadas por um operador no backend. Confirmar o e-mail não exclui dados. O link usa fragmento, sem token na query string, e a página de acompanhamento não carrega Analytics ou AdSense. A navegação para ela usa uma carga completa de página para isolar scripts previamente carregados.

Os dados públicos continuam em cache no Laravel. O Next e caches HTTP não guardam essas respostas: assim, a revisão durável do backend invalida ficha, busca, relacionados e sitemap após a aprovação. A ocultação usa uma tabela separada do cadastro importado e sobrevive à atualização de uma empresa.

## Medição e experimentos

Os eventos de página incluem `content_group` com `home`, `busca`, `cidades`, `cidade` ou `empresa`, sem termos da busca na URL enviada explicitamente. No GA4, conferir a configuração de medição aprimorada de histórico para evitar contagens duplicadas com os eventos manuais de navegação.

Antes de ativar `CNPJ_EXTRA_AD_SLOT`, registrar por dispositivo: visualizações, RPM de página, receita, cobertura e Active View. Comparar períodos equivalentes e acompanhar CLS/LCP e navegação. O bloco opcional permite experimentar uma posição adicional; não constitui um teste A/B randomizado nem garante aumento de receita. Novas páginas por CNAE/cidade devem ser priorizadas após analisar demanda no Search Console.
