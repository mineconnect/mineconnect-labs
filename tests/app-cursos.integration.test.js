/**
 * @jest-environment jsdom
 *
 * Integración de cursos.html: monta la página, ejecuta app-cursos.js y verifica
 * que el temario y los canales se rendericen con links de YouTube reales.
 */
import fs from 'fs';
import path from 'path';

// jsdom no implementa canvas: devolvemos null para que el fondo salga limpio (sin ruido).
HTMLCanvasElement.prototype.getContext = () => null;

const html = fs.readFileSync(path.join(process.cwd(), 'cursos.html'), 'utf8');
const body = html.split('<body>')[1].split('</body>')[0];

async function montar() {
  document.body.innerHTML = body;
  jest.resetModules();
  await import('../assets/js/app-cursos.js');
}

describe('integración cursos.html', () => {
  test('renderiza los 3 cursos con su temario en módulos', async () => {
    await montar();
    const cards = document.querySelectorAll('#cursos-detalle .card');
    expect(cards.length).toBe(3);
    expect(document.querySelectorAll('#cursos-detalle .modulo').length).toBeGreaterThan(10);
  });

  test('cada lección tiene un link "Ver videos gratis" a YouTube', async () => {
    await montar();
    const links = document.querySelectorAll('#cursos-detalle .lec a');
    expect(links.length).toBeGreaterThan(10);
    for (const a of links) {
      expect(a.getAttribute('href')).toContain('youtube.com/results');
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });

  test('muestra el anclaje de precio (valor tachado + ahorro)', async () => {
    await montar();
    expect(document.querySelector('#cursos-detalle .valor-real')).not.toBeNull();
    expect(document.body.textContent).toContain('Ahorrás');
  });

  test('renderiza los canales recomendados con URL de YouTube', async () => {
    await montar();
    const canales = document.querySelectorAll('#canales-grid a');
    expect(canales.length).toBeGreaterThanOrEqual(5);
    for (const a of canales) {
      expect(a.getAttribute('href')).toContain('youtube.com');
    }
  });

  test('existe el canvas del fondo animado', async () => {
    await montar();
    expect(document.getElementById('fx-bg')).not.toBeNull();
  });
});
