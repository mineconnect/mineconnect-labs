/**
 * @jest-environment jsdom
 *
 * Test de integración: monta el index.html real, ejecuta app.js y verifica
 * el flujo completo que cierra ventas (planes, cotizador y link a WhatsApp).
 */
import fs from 'fs';
import path from 'path';

// jsdom no implementa canvas: devolvemos null para que el fondo salga limpio (sin ruido).
HTMLCanvasElement.prototype.getContext = () => null;

// jest se ejecuta desde la raíz del proyecto (labs/).
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
// Tomamos solo el <body> para montarlo en jsdom.
const body = html.split('<body>')[1].split('</body>')[0];

async function montar() {
  document.body.innerHTML = body;
  // Importamos app.js DESPUÉS de tener el DOM: su init() corre al importar.
  jest.resetModules();
  await import('../assets/js/app.js');
}

describe('integración app.js', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  test('renderiza los 4 planes en el grid', async () => {
    await montar();
    const planes = document.querySelectorAll('#planes-grid .plan');
    expect(planes.length).toBe(4);
    expect(document.body.textContent).toContain('Landing Express');
    expect(document.body.textContent).toContain('Web Pro');
  });

  test('renderiza los 3 cursos premium con precio y ahorro', async () => {
    await montar();
    const cursos = document.querySelectorAll('#cursos-grid .curso');
    expect(cursos.length).toBe(3);
    expect(document.body.textContent).toContain('IA desde Cero');
    expect(document.body.textContent).toContain('Ahorrás');
    // El curso destacado muestra su etiqueta.
    expect(document.querySelector('#cursos-grid .destacado')).not.toBeNull();
  });

  test('clic en "Inscribirme" preselecciona Curso de IA en el formulario', async () => {
    await montar();
    document.querySelector('#cursos-grid [data-curso]').dispatchEvent(new Event('click', { bubbles: true }));
    expect(document.querySelector('#f-tipo').value).toBe('Curso de IA');
  });

  test('existe el canvas del fondo animado', async () => {
    await montar();
    expect(document.getElementById('fx-bg')).not.toBeNull();
  });

  test('pobla el select de tipos de proyecto', async () => {
    await montar();
    const opciones = document.querySelectorAll('#f-tipo option');
    expect(opciones.length).toBeGreaterThanOrEqual(6);
  });

  test('muestra una estimación inicial con formato de precio', async () => {
    await montar();
    expect(document.querySelector('#estimado-val').textContent).toMatch(/\$[\d.]+ a \$[\d.]+/);
  });

  test('un lead inválido NO dispara WhatsApp y muestra errores', async () => {
    await montar();
    document.querySelector('#lead-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(window.open).not.toHaveBeenCalled();
    expect(document.querySelector('.field-error[data-for="nombre"]').textContent).toBeTruthy();
  });

  test('un lead válido abre WhatsApp con los datos cargados (cierra la venta)', async () => {
    await montar();
    document.querySelector('#f-nombre').value = 'Facundo';
    document.querySelector('#f-negocio').value = 'Bar La Esquina';
    document.querySelector('#f-tipo').value = 'Landing page';
    document.querySelector('#f-contacto').value = 'facu@bar.com';

    document.querySelector('#lead-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(window.open).toHaveBeenCalledTimes(1);
    const url = window.open.mock.calls[0][0];
    expect(url).toContain('https://wa.me/5493834327244');
    expect(decodeURIComponent(url)).toContain('Facundo');
    expect(decodeURIComponent(url)).toContain('Bar La Esquina');
    expect(document.querySelector('#form-ok').classList.contains('show')).toBe(true);
  });

  test('el botón de mailto apunta al correo del negocio', async () => {
    await montar();
    document.querySelector('#f-nombre').value = 'Ana';
    document.querySelector('#lead-form').dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('#mailto-link').getAttribute('href')).toContain('mailto:contacto@mineconnect.com.ar');
  });
});
