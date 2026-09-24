import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(file) {
  const filename = resolve(file);
  const source = readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  const localRequire = (name) => name.startsWith('./') ? load(resolve(dirname(filename), `${name}.ts`))
    : name.startsWith('@/') ? load(resolve('src', `${name.slice(2)}.ts`)) : require(name);
  new Function('exports', 'require', outputText)(exports, localRequire);
  return exports;
}
const company = load('src/lib/company.ts');
const fixture = { id: 1, cnpj: '16410532000137', name: 'Empresa São João', city: 'São Paulo', state: 'SP' };

test('preserves existing local company URLs and rejects external destinations', () => {
  assert.equal(company.companyPath({ ...fixture, url: '/sao-paulo-sp/16410532000137/empresa-antiga/' }), '/sao-paulo-sp/16410532000137/empresa-antiga');
  assert.equal(company.companyPath({ ...fixture, url: 'https://evil.example/phishing' }), '/sao-paulo-sp/16410532000137/empresa-sao-joao');
  assert.equal(company.companyPath({ ...fixture, url: '/sao-paulo-sp/99999999999999/outro' }), '/sao-paulo-sp/16410532000137/empresa-sao-joao');
});

test('removes trailing CPF from display without truncating legitimate numeric names', () => {
  assert.equal(company.publicName('Pessoa 123.456.789-00'), 'Pessoa');
  assert.equal(company.publicName('Pessoa 12345678900'), 'Pessoa');
  assert.equal(company.publicName('Empresa 12345678901234'), 'Empresa 12345678901234');
  assert.equal(company.publicName('Loja 2026'), 'Loja 2026');
});

test('formats numeric and alphanumeric CNPJ and safely embeds structured data', () => {
  assert.equal(company.formatCnpj('16410532000137'), '16.410.532/0001-37');
  assert.equal(company.formatCnpj('12ABC34501DE35'), '12.ABC.345/01DE-35');
  const escaped = company.jsonLd({ name: '</script><script>alert(1)</script>' });
  assert.equal(escaped.includes('<'), false);
  assert.equal(JSON.parse(escaped).name, '</script><script>alert(1)</script>');
});

test('sitemap escapes XML and omits artificial last-modified dates', async () => {
  const { sitemapXml } = load('src/lib/sitemap.ts');
  const response = sitemapXml('urlset', [{ path: '/a?x=1&y=2', lastmod: '2026-09-01T00:00:00Z' }, { path: '/b', lastmod: '0000-00-00' }]);
  const xml = await response.text();
  assert.match(xml, /x=1&amp;y=2/);
  assert.match(xml, /<lastmod>2026-09-01<\/lastmod>/);
  assert.equal((xml.match(/<lastmod>/g) || []).length, 1);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('API distinguishes an outage from a removed company and bypasses frontend caches', async t => {
  const original = global.fetch;
  t.after(() => { global.fetch = original; });
  const api = load('src/lib/api.ts');
  global.fetch = async (_url, options) => { assert.equal(options.cache, 'no-store'); return new Response('{}', { status: 503 }); };
  await assert.rejects(api.fetchCnpjCompany('16410532000137'), /503/);
  global.fetch = async () => new Response('{}', { status: 404 });
  assert.equal(await api.fetchCnpjCompany('16410532000137'), null);
});

test('sitemap outage returns 503 instead of publishing an empty successful index', async t => {
  const original = global.fetch;
  t.after(() => { global.fetch = original; });
  global.fetch = async () => new Response('{}', { status: 503 });
  const { GET } = load('src/app/sitemap.xml/route.ts');
  assert.equal((await GET()).status, 503);
});

test('request proxy rejects foreign origins and does not expose backend errors', async t => {
  const original = global.fetch;
  t.after(() => { global.fetch = original; });
  const { NextRequest } = require('next/server');
  const { proxyRequest } = load('src/lib/request-proxy.ts');
  const request = origin => new NextRequest('https://cnpj.parafa.com.br/api/solicitacoes', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{}' });
  global.fetch = async () => { throw new Error('Unexpected network'); };
  assert.equal((await proxyRequest(request('https://evil.example'), 'requests')).status, 403);
  global.fetch = async () => Response.json({ message: 'SQL credentials and internal stack' }, { status: 500 });
  const response = await proxyRequest(request('https://cnpj.parafa.com.br'), 'requests');
  assert.equal(response.status, 500);
  assert.doesNotMatch(await response.text(), /SQL credentials/);
});
