// Run after npm run build. All API data and mail responses below are fixtures.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { cpSync } from 'node:fs';

const apiPort = 43101;
const sitePort = 43102;
const company = {
  id: 1, cnpj: '16410532000137', name: 'Empresa de demonstração', city: 'Salvador', state: 'BA',
  url: '/salvador-ba/16410532000137/empresa-demonstracao',
  street: 'Rua de teste', number: '123', opening: '2020-01-01', last_update: '2026-09-01',
  activity: { code: '123', name: 'Atividade principal' }, secondary_activities: [{ activities: { code: '456', name: 'Atividade secundária' } }],
};
const city = { id: 1, name: 'Salvador', state: 'BA', url: 'salvador' };
const api = createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${apiPort}`);
  response.setHeader('Content-Type', 'application/json');
  let payload;
  if (url.pathname === '/api/cnpj/companies/00000000000000') { response.statusCode = 404; payload = {}; }
  else if (url.pathname === '/api/cnpj/companies/99999999999999') { response.statusCode = 503; payload = {}; }
  else if (url.pathname.startsWith('/api/cnpj/companies/')) payload = { data: company, related: [] };
  else if (url.pathname === '/api/cnpj/companies') payload = { data: [company], meta: { current_page: 1, per_page: 20, has_more_pages: false } };
  else if (url.pathname === '/api/cnpj/cities/salvador-ba') payload = { city, data: [company], meta: { has_more_pages: false } };
  else if (['/api/cnpj/cities', '/api/cnpj/best-cities'].includes(url.pathname)) payload = { data: [city] };
  else if (url.pathname === '/api/cnpj/sitemaps') payload = { pages: 1 };
  else if (url.pathname === '/api/cnpj/sitemaps/1') payload = { data: [company] };
  else if (url.pathname === '/api/cnpj/requests') { response.statusCode = 201; payload = { protocol: 'test-protocol', message: 'Confira seu e-mail.' }; }
  else { response.statusCode = 404; payload = {}; }
  response.end(JSON.stringify(payload));
});
await new Promise((resolve, reject) => { api.once('error', reject); api.listen(apiPort, '127.0.0.1', resolve); });
cpSync('public', '.next/standalone/public', { recursive: true });
cpSync('.next/static', '.next/standalone/.next/static', { recursive: true });
const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  env: { ...process.env, HOSTNAME: "127.0.0.1", PORT: String(sitePort), API_URL: `http://127.0.0.1:${apiPort}/api` }, stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
const base = `http://127.0.0.1:${sitePort}`;
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break; } } catch { /* waiting for startup */ }
    if (server.exitCode !== null) throw new Error(output);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, output);
  const contact = await fetch(`${base}/contato`, { redirect: 'manual' });
  assert.equal(contact.status, 308);
  assert.equal(contact.headers.get('location'), 'https://parafa.com.br/contato');
  const legacy = await fetch(`${base}/salvador-ba/16410532000137`, { redirect: 'manual' });
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get('location'), company.url);
  const alternative = await fetch(`${base}/outra-cidade-sp/16410532000137/qualquer`, { redirect: 'manual' });
  assert.equal(alternative.status, 308);
  assert.equal(alternative.headers.get('location'), company.url);
  const search = await fetch(`${base}/busca?busca=16410532000137&page=2`, { redirect: 'manual' });
  assert.equal(search.status, 308);
  assert.match(search.headers.get('location'), /search=16410532000137&page=2/);
  const privacy = await fetch(`${base}/${encodeURI('política-de-privacidade')}`, { redirect: 'manual' });
  assert.equal(privacy.status, 308);
  const detailResponse = await fetch(base + company.url);
  assert.equal(detailResponse.status, 200);
  const detail = await detailResponse.text();
  assert.match(detail, /Solicitar remoção ou correção/);
  assert.match(detail, /Atividade secundária/);
  assert.match(detail, /Rua de teste, 123/);
  assert.match(detail, /rel="canonical" href="https:\/\/cnpj.parafa.com.br\/salvador-ba\/16410532000137\/empresa-demonstracao"/);
  assert.match(detail, /01\/01\/2020/);
  assert.match(detail, /application\/ld\+json/);
  const removal = await (await fetch(`${base}/remocao`)).text();
  assert.doesNotMatch(removal, /pagead2\.googlesyndication\.com|googletagmanager\.com\/gtag/);
  assert.match(removal, /noindex/);
  assert.equal((await fetch(`${base}/salvador-ba/00000000000000/ausente`)).status, 404);
  assert.notEqual((await fetch(`${base}/salvador-ba/99999999999999/indisponivel`)).status, 404);
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.match(sitemap, /sitemaps\/companies\/1.xml/);
  const shard = await (await fetch(`${base}/sitemaps/companies/1.xml`)).text();
  assert.match(shard, /empresa-demonstracao/);
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.match(robots, /Sitemap: https:\/\/cnpj.parafa.com.br\/sitemap.xml/);
  assert.match(await (await fetch(`${base}/ads.txt`)).text(), /pub-9322585020374860/);
  const submission = await fetch(`${base}/api/solicitacoes`, { method: 'POST', headers: { origin: base, 'content-type': 'application/json' }, body: JSON.stringify({ cnpj: company.cnpj }) });
  assert.equal(submission.status, 201);
  assert.equal((await submission.json()).protocol, 'test-protocol');
  console.log('Smoke HTTP: redirects, SEO, company content, request proxy, privacy, 404/outage, robots, ads.txt and sitemaps passed.');
} catch (error) {
  console.error(output.slice(-2500));
  throw error;
} finally {
  server.kill('SIGTERM');
  api.close();
}
