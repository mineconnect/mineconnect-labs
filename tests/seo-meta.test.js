/**
 * @jest-environment node
 *
 * SEO/social de las páginas PÚBLICAS de Labs (index, cursos): deben tener
 * canonical, og:url y og:image absolutos para indexar y compartir bien.
 * Las herramientas internas (campana, crm) deben seguir noindex.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const BASE = 'https://mineconnect.github.io/mineconnect-labs';

const PUBLIC_PAGES = ['index.html', 'cursos.html'];
const INTERNAL_PAGES = ['campana.html', 'crm.html'];

function attr(html, prop, attrName, valName) {
  const re = new RegExp(
    `<(?:meta|link)[^>]*\\b${attrName}="${prop}"[^>]*\\b${valName}="([^"]*)"|` +
    `<(?:meta|link)[^>]*\\b${valName}="([^"]*)"[^>]*\\b${attrName}="${prop}"`,
    'i'
  );
  const m = html.match(re);
  return m ? (m[1] ?? m[2]) : null;
}

describe.each(PUBLIC_PAGES)('SEO público — %s', (page) => {
  const html = read(page);
  test('canonical absoluto', () => {
    expect(attr(html, 'canonical', 'rel', 'href')).toMatch(new RegExp(`^${BASE}`));
  });
  test('og:url absoluto', () => {
    expect(attr(html, 'og:url', 'property', 'content')).toMatch(new RegExp(`^${BASE}`));
  });
  test('og:image absoluto', () => {
    expect(attr(html, 'og:image', 'property', 'content')).toMatch(/^https:\/\//);
  });
});

describe.each(INTERNAL_PAGES)('Herramienta interna no indexable — %s', (page) => {
  test('tiene noindex', () => {
    expect(read(page)).toMatch(/<meta name="robots" content="noindex"/i);
  });
});
